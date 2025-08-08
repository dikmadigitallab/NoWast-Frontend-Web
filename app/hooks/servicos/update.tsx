import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import { useSectionStore } from "@/app/store/renderSection";
import { useRouter } from "next/navigation";
import api from "../api";

export const useUpdateService = (redirect?: string) => {

    const [loading, setLoading] = useState(false);
    const { setSection, section } = useSectionStore();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const update = async (id: string, data: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.put(`/service/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Atualização feita com sucesso");
            setTimeout(() => {
                if (section === 1) {
                    setSection(2);
                } else {
                    if (redirect) {
                        setSection(1);
                        localStorage.removeItem('id-storage');
                        router.push(redirect);
                    }
                }
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
    };
};