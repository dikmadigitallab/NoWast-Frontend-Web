import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import { useRouter } from "next/navigation";
import { useGetIDStore } from "@/app/store/getIDStore";
import { getToastMessageRequest } from "@/app/utils/getToastMessageByType";

export const useDelete = (url: string, redirect?: string) => {

    const { id } = useGetIDStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }


        try {
            await api.delete(`/${url}/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Item deletado com sucesso!");
            setTimeout(() => {
                if (redirect) {
                    router.push(redirect)
                } else {
                    router.back();
                }
            }, 1000);
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error("Erro ao deletar item.");
        }
    };

    return {
        handleDelete,
        loading,
        error,
    };
};

