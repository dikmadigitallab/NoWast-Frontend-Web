import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";
import { Logout } from "@/app/utils/logout";

export const useCreateSetorEmpresarial = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const createSetorEmpresarial = async (setor: string) => {

        setError(null);
        setLoading(true);

        const novoSetor = { description: setor }

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.post("/businessSector", novoSetor, {
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
        createSetorEmpresarial,
        loading,
        error,
        data
    };
};