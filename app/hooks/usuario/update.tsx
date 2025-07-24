'use client';
import { useState } from "react";
import { toast } from "react-toastify";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import api from "../api";

export const useUpdateUsuario = () => {

    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUsuario = async (id: number, novoUsuario: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.put(`/building/${id}`, novoUsuario, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data);
            toast.success("Prédio Atualizado com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/usuario/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao atualizar usuario");
            toast.error("Erro ao atualizar setor");
        }
    };

    return {
        updateUsuario,
        loading,
        error,
        data
    };
};