"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api';

interface TerminateUserData {
    endDate: string;
}

export const useTerminateUser = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const terminate = async (userId: number, data: TerminateUserData) => {
        setLoading(true);
        try {
            const response = await api.post(`/users/${userId}/terminate`, data);
            
            if (response.status === 200 || response.status === 201) {
                // Redirecionar para a listagem após sucesso
                router.push('/usuario/listagem');
                return response.data;
            }
        } catch (error: any) {
            console.error('Erro ao desabilitar usuário:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { terminate, loading };
};
