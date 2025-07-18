import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";

export const useCreatePredio = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const createPredio = async (setor: string) => {

        setError(null);
        setLoading(true);


        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.post("/building", setor, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data.data);
            toast.success("Setor Empresarial criado com sucesso");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Erro ao criar setor empresarial");
            toast.error("Erro ao criar setor empresarial");
        }
    };

    return {
        createPredio,
        loading,
        error,
        data
    };
};