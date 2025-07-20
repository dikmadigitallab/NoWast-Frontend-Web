import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import api from "../../api";

export const useCreateEpi = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [epi, setEpi] = useState(null);

    const createEpi = async (Epi: string) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.post("/ppe", Epi, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setEpi(response.data.data);
            toast.success("Epi criada com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/Epis/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao criar Epi empresarial");
            toast.error("Erro ao criar Epi empresarial");
        }
    };

    return {
        createEpi,
        loading,
        error,
        epi
    };
};