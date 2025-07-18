'use client';
import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useRouter } from "next/navigation";

export const useUpdateSetor = () => {

    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateSetor = async (id: number, novoSetor: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.put(`/sector/${id}`, novoSetor, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data);
            toast.success("Setor Atualizado com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/setor/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao atualizar setor");
            toast.error("Erro ao atualizar setor");
        }
    };

    return {
        updateSetor,
        loading,
        error,
        data
    };
};