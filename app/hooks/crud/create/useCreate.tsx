import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useRouter } from "next/navigation";

export const useCreate = (url: string, redirect: string) => {

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

            if (img) {
                const formData = new FormData();
                formData.append("file", img);

                await api.post(`/users/${response.data.data.id}/upload-profile-image`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken?.split("=")[1]}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

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