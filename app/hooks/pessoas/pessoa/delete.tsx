import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../../api";

export const useDeletePessoa = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePessoa = async (id: number) => {
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

            toast.success("Pessoa Empresarial excluído com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/pessoa/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao excluir pessoa empresarial");
            toast.error("Erro ao excluir pessoa empresarial");
        }
    };

    return {
        deletePessoa,
        loading,
        error
    };
};
