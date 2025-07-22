import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useSectionStore } from "@/app/store/renderSection";

export const useCreatePessoa = () => {

    const { setId } = useGetIDStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const { setSection } = useSectionStore();

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
            const response = await api.post("/person", pessoa, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setId(response.data.data.id);
            setData(response.data.data);
            toast.success("Pessoa criada com sucesso");
            setLoading(false);
            setSection(2);
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