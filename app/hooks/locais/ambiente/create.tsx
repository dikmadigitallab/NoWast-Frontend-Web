import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useSectionStore } from "@/app/store/renderSection";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useRouter } from "next/navigation";

export const useCreateAmbiente = (url: string, redirect?: string) => {

    const { setId } = useGetIDStore();
    const [loading, setLoading] = useState(false);
    const { setSection, section } = useSectionStore();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const create = async (data: any) => {

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

            toast.success("Cadastro feito com sucesso");
            setTimeout(() => {
                if (section === 1) {
                    setId(response.data.data.id)
                    setSection(2);
                } else {
                    if (redirect) {
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
        create,
        loading,
        error,
    };
};