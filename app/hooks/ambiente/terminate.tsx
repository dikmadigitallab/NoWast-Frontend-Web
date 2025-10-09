"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api';

interface TerminateEnvironmentData {
    deletedAt: string;
}

export const useTerminateEnvironment = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const terminate = async (environmentId: number, data: TerminateEnvironmentData) => {
        setLoading(true);
        try {
            const response = await api.delete(`/environment/${environmentId}`, { data });
            
            if (response.status === 200 || response.status === 204) {
                // Redirecionar para a listagem após sucesso
                router.push('/locais/ambiente/listagem');
                return response.data;
            }
        } catch (error: any) {
            console.error('Erro ao desabilitar ambiente:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { terminate, loading };
};
