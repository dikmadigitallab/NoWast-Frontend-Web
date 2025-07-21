'use client';
import api from "../api";
import { useState } from "react";
import { toast } from "react-toastify";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { getToastMessageRequest } from "@/app/utils/getToastMessageByType";

export const useUpdateItem = (url: string) => {

    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateItem = async (id: number, novoItem: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        const toastMessages = getToastMessageRequest(url as any, "update");

        try {
            const response = await api.put(`/${url}/${id}`, novoItem, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(toastMessages.success);
            setData(response.data);
            setLoading(false);
            router.back()
        } catch (error) {
            setLoading(false);
            toast.success(toastMessages.error);
        }
    };

    return {
        updateItem,
        loading,
        error,
        data
    };
};