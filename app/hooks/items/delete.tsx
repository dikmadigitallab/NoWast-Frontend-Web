import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useRouter } from "next/navigation";
import { useGetIDStore } from "@/app/store/getIDStore";
import { getToastMessageRequest } from "@/app/utils/getToastMessageByType";

export const useDeleteItem = (url: string) => {
    const { id } = useGetIDStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteItem = async () => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        const toastMessages = getToastMessageRequest(url as any, "delete");

        try {
            await api.delete(`/${url}/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(toastMessages.success);
            setLoading(false);
            router.back();
        } catch (error) {
            setLoading(false);
            setError(toastMessages.error);
            toast.error(toastMessages.error);
        }
    };

    return {
        deleteItem,
        loading,
        error,
    };
};
