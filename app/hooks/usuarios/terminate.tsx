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
            const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

            if (!authToken) {
                console.error('Token de autenticação não encontrado');
                setLoading(false);
                return;
            }

            const response = await api.post(`/users/${userId}/terminate`, data, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json"
                }
            });
            
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
