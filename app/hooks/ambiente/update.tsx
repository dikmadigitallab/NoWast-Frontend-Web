import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../api";
import { useSectionStore } from "@/app/store/renderSection";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useRouter } from "next/navigation";

export const useUpdateAmbiente = (url: string, redirect?: string) => {

    const { id, setIdService } = useGetIDStore();
    const [loading, setLoading] = useState(false);
    const { setSection, section } = useSectionStore();
    const [error, setError] = useState<string | null>(null);
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

            // Verifica se a resposta tem a estrutura esperada e se há serviços
            if (response.data?.data?.services && response.data.data.services.length > 0) {
                setIdService(response.data.data.services[0].id);
            }
            
            // Usa a mensagem da API se disponível, senão usa mensagem padrão
            const successMessage = response.data?.messages?.[0] || "Atualização feita com sucesso";
            toast.success(successMessage);
            
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