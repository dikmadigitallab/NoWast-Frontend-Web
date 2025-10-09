import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../api";

export const useUpdateServiceItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateServiceItem = async (itemId: number, data: { name: string }) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        try {
            const response = await api.put(`/service-items/${itemId}`, data, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.hasSuccess) {
                toast.success("Item de checklist atualizado com sucesso");
                return response.data.data; // Retorna apenas os dados do item atualizado
            } else {
                throw new Error("Falha ao atualizar item");
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateServiceItem,
        loading,
        error,
    };
};
