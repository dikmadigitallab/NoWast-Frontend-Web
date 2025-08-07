import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";

export const useCreateServiceEnvironment = () => {

    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, typeof value === "object" ? JSON.stringify(value) : value as string | Blob);
            }
        });

        try {
            const response = await api.post(`/activity`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                },
            });

            setData(response.data.data);
            toast.success("Cadastro feito com sucesso");

            setTimeout(() => {
                router.push("/atividade/listagem");
            });

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
