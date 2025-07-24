import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../../api";
import { useRouter } from "next/navigation";
import { useSectionStore } from "@/app/store/renderSection";

export const useCreateEmail = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setSection } = useSectionStore();

    const createEmail = async (email: any) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        try {
            // Verifica se email tem a propriedade emails (para compatibilidade)
            const emails = email.emails ? email.emails : [email];

            // Filtra apenas objetos válidos
            const emailsValidos = emails.filter((e: any) => typeof e === "object" && Object.keys(e).length > 0);

            if (emailsValidos.length === 0) {
                throw new Error("Nenhum e-mail válido fornecido");
            }

            const promises = emailsValidos.map((email: any) =>
                api.post("/email", email, {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json",
                    },
                })
            );

            await Promise.all(promises);

            toast.success(emailsValidos.length > 1 ? "E-mails criados com sucesso" : "E-mail criado com sucesso");
            setLoading(false);

            setTimeout(() => {
                setSection(1);
                router.push("/pessoa/listagem");
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