import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import api from "../api";

export const useCreateUsuario = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const createUsuario = async (usuario: any) => {

        setError(null);
        setLoading(true);


        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {
            const response = await api.post("/users", usuario, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data.data);
            toast.success("Usuario criada com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.push('/usuarios/listagem');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setError("Erro ao criar usuario empresarial");
            toast.error("Erro ao criar usuario empresarial");
        }
    };

    return {
        createUsuario,
        loading,
        error,
        data
    };
};