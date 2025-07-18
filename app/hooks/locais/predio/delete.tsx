import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";

export const useDeletePredio = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePredio = async (id: string) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            await api.delete(`/building/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Setor Empresarial excluído com sucesso");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Erro ao excluir setor empresarial");
            toast.error("Erro ao excluir setor empresarial");
        }
    };

    return {
        deletePredio,
        loading,
        error
    };
};
