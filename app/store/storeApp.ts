"use client";
import { create } from 'zustand';

interface UserInfo {
    email: string | null;
    document: string | null;
    name: string | null;
    position: string | null;
    contractId: string | number | null
}

type UserType = 'DEFAULT' | 'ADM_DIKMA' | 'OPERATIONAL' | 'GESTAO' | 'ADM_CLIENTE' | 'DIKMA_DIRECTOR' | null;

interface AuthStore {
    id: number | null;
    userInfo: UserInfo;
    userType: UserType;
    setId: (id: number | null) => void;
    setUserInfo: (userInfo: UserInfo) => void;
    setUserType: (userType: UserType) => void;
}

const encrypt = (data: string): string => {
    return btoa(data);
};

const decrypt = (data: string): string => {
    try {
        return atob(data);
    } catch (err) {
        return '';
    }
};

export const useAuthStore = create<AuthStore>((set, get) => {
    let storedId: number | null = null;
    let storedUserInfo: UserInfo = {
        email: null,
        document: null,
        name: null,
        position: null,
        contractId: null
    };
    let storedUserType: UserType = null;

    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
            const decoded = decrypt(stored);
            try {
                const userData = JSON.parse(decoded);
                storedId = userData?.id || null;
                storedUserInfo = userData?.userInfo || { email: null, document: null, name: null, position: null, contractId: null };
                storedUserType = userData?.userType || null;
            } catch (err) {
                console.warn("Dados de usuário inválidos:", decoded);
            }
        }
    }

    const persist = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'user',
                encrypt(
                    JSON.stringify({
                        id: get().id,
                        userInfo: get().userInfo,
                        userType: get().userType,
                    })
                )
            );
        }
    };

    return {
        id: storedId,
        userInfo: storedUserInfo,
        userType: storedUserType,

        setId: (id) => {
            set({ id });
            persist();
        },

        setUserInfo: (userInfo) => {
            set({ userInfo });
            persist();
        },

        setUserType: (userType) => {
            set({ userType });
            persist();
        },
    };
});
