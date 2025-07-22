import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useRouter } from "next/navigation";

export const useCreateEmail = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEmail = async (email: any) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout()
            return;
        }

        try {

            const emails = email.emails.map((email: any) =>
                typeof email === "object" ? email : {}
            );

            const promises = emails.map((email: any) =>
                api.post("/email", email, {
                    headers: {
                        Authorization: `Bearer ${authToken?.split("=")[1]}`,
                        "Content-Type": "application/json",
                    },
                })
            );

            await Promise.all(promises);

            toast.success("Endereço criado com sucesso");
            setLoading(false);
            setTimeout(() => {
                router.back();
            }, 1000);

        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return {
        createEmail,
        loading,
        error,
    };
};