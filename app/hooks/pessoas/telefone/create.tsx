import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useSectionStore } from "@/app/store/renderSection";

export const useCreateTelefone = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setSection } = useSectionStore();

    const createTelefone = async (telefone: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {

            const telefones = telefone.phones.map((telefone: any) =>
                typeof telefone === "object" ? telefone : {}
            );

            const promises = telefones.map((telefone: any) =>
                api.post("/phone", telefone, {
                    headers: {
                        Authorization: `Bearer ${authToken?.split("=")[1]}`,
                        "Content-Type": "application/json",
                    },
                })
            );

            await Promise.all(promises);

            toast.success("Telefone criado com sucesso");
            setLoading(false);
            setSection(4);
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        createTelefone,
        loading,
        error,
    };
};