'use client';

import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";

export const useSoftDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const softDeleteUser = async (userId: number) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        try {
            // Faz um PUT para atualizar apenas o campo deletedAt
            await api.put(`/users/${userId}`, {
                deletedAt: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Usuário excluído com sucesso!");
            setLoading(false);
            
            // Recarrega a página para atualizar a listagem
            window.location.reload();

        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro ao excluir usuário";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        softDeleteUser,
        loading,
        error,
    };
};
