import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useSectionStore } from "@/app/store/renderSection";

export const useCreateEndereco = () => {

    const { setSection } = useSectionStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEndereco = async (endereco: any) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {

            const enderecos = endereco.addresses ? endereco.addresses : [endereco];
            const enderecosValidos = enderecos.filter((e: any) => typeof e === "object" && Object.keys(e).length > 0);

            if (enderecosValidos.length === 0) {
                throw new Error("Nenhum endereço válido fornecido");
            }

            const promises = enderecosValidos.map((endereco: any) =>
                api.post("/address", endereco, {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json",
                    },
                })
            );

            await Promise.all(promises);

            toast.success(enderecosValidos.length > 1 ? "Endereços criados com sucesso" : "Endereço criado com sucesso");
            setLoading(false);
            setSection(3);
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        createEndereco,
        loading,
        error,
    };
};