import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useRouter } from "next/navigation";
import { useGetIDStore } from "@/app/store/getIDStore";

export const useUpdate = (url: string, redirect: string) => {

    const { id } = useGetIDStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const router = useRouter();

    const update = async (data: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.put(`/${url}/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data.data);
            toast.success("Atualização feito com sucesso");

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
        update,
        loading,
        error,
        data
    };
};