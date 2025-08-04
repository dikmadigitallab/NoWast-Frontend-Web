import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";
import { useGetIDStore } from "@/app/store/getIDStore";

export const useUpdateItem = (url: string, redirect: string) => {

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
            Logout();
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("responsibleManagerId", String(data.responsibleManager.connect.id));
            formData.append("buildingId", String(data.buildingId));
            formData.append("file", data.file);

            const response = await api.patch(`/ppe/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setData(response.data.data);
            toast.success("Item atualizado com sucesso");

            setTimeout(() => {
                router.push(redirect);
            });
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
