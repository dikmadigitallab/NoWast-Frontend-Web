import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import api from "../api";
import { getToastMessageRequest } from "@/app/utils/getToastMessageByType";

export const useCreateItem = (url: string) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const createItem = async (Item: string) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        const toastMessages = getToastMessageRequest(url as any, "create");

        try {
            const response = await api.post(`/${url}`, Item, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(toastMessages.success);
            setData(response.data.data);
            setLoading(false);
            router.back();
        } catch (error) {
            setLoading(false);
            toast.success(toastMessages.error);
        }
    };

    return {
        createItem,
        loading,
        error,
        data
    };
};