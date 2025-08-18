import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";

export const useCreateActivity = () => {
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

        if (data.images && Array.isArray(data.images)) {
            data.images.forEach((file: File, index: number) => {
                formData.append(`images`, file); 
            });
        }

        for (const [key, value] of Object.entries(data)) {
            if (key === 'images') continue;
            
            if (value !== undefined && value !== null) {
                if (typeof value === 'object' && !(value instanceof Blob)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value as string | Blob);
                }
            }
        }

        try {
            const response = await api.post(`/activity`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    'Content-Type': 'multipart/form-data', 
                },
            });

            setData(response.data.data);
            toast.success("Atividade criada com sucesso!");

            setTimeout(() => {
                router.push("/atividade/listagem");
            }, 1000); 

        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro ao criar atividade";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        loading,
        error,
        data,
    };
};