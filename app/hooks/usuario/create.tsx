import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../api";
import { useRouter } from "next/navigation";

export const useCreatePessoa = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const router = useRouter();

    const createPessoa = async (pessoa: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {

            const response = await api.post("/users", pessoa, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });


            setData(response.data.data);
            toast.success("Pessoa criada com sucesso");
            setLoading(false);

            setTimeout(() => {
                router.push("/usuario/listagem");
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        createPessoa,
        loading,
        error,
        data
    };
};