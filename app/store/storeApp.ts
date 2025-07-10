"use client";
import { create } from 'zustand';

type UserType = 'ADM_DIKMA' | 'GESTAO' | 'CLIENTE_DIKMA' | 'DIKMA_DIRETORIA' | null;

interface AuthStore {
    userType: UserType;
    setUserType: (type: UserType) => void;
    clearUserType: () => void;
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
    let storedType: UserType = null;

    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('userType');
        if (stored) {
            const decoded = decrypt(stored);
            if (['ADM_DIKMA', 'GESTAO', 'CLIENTE_DIKMA', 'DIKMA_DIRETORIA'].includes(decoded)) {
                storedType = decoded as UserType;
            } else {
                console.warn("Tipo de usuário inválido:", decoded);
            }
        }
    }

    return {
        userType: storedType,
        setUserType: (type) => {
            if (type && typeof window !== 'undefined') {
                localStorage.setItem('userType', encrypt(type));
            }
            set({ userType: type });
        },
        clearUserType: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userType');
            }
            set({ userType: null });
        },
    };
});
