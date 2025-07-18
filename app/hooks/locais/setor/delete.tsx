import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import { useRouter } from "next/navigation";

export const useDeleteSetor = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteSetor = async (id: number) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            await api.delete(`/sector/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Setor Empresarial excluído com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/locais/setor/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao excluir setor empresarial");
            toast.error("Erro ao excluir setor empresarial");
        }
    };

    return {
        deleteSetor,
        loading,
        error
    };
};
