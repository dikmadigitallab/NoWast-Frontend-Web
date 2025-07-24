import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../api";

export const useDeleteUsuario = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUsuario = async (id: number) => {
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

            toast.success("Usuario Empresarial excluído com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/usuario/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao excluir usuario empresarial");
            toast.error("Erro ao excluir usuario empresarial");
        }
    };

    return {
        deleteUsuario,
        loading,
        error
    };
};
