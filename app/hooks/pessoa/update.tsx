'use client';
import { useState } from "react";
import { toast } from "react-toastify";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import api from "../api";

export const useUpdatePredio = () => {

    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePredio = async (id: number, novoPredio: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.put(`/building/${id}`, novoPredio, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data);
            toast.success("Prédio Atualizado com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/predio/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao atualizar predio");
            toast.error("Erro ao atualizar setor");
        }
    };

    return {
        updatePredio,
        loading,
        error,
        data
    };
};