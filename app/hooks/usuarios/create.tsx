'use client';

import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";

export const useCreateUser = (url: string, redirect: string) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const router = useRouter();

    const create = async (data: any, img?: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.post(`/${url}`, data, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            const formData = new FormData();
            formData.append("image", img);

            await api.post(`/users/${response.data.data.id}/upload-profile-image`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setData(response.data.data);
            toast.success("Cadastro feito com sucesso");

            setTimeout(() => {
                router.push(redirect);
            })

        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        create,
        loading,
        error,
        data
    };
};