import { Logout } from "@/app/utils/logout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../../api";

export const useCreate = (url: string, redirect: string) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any, containsImg?: boolean) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            return;
        }

        try {
            if (containsImg) {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === "image" && value instanceof File) {
                            formData.append(key, value);
                        } else if (typeof value === "object" && !(value instanceof File)) {
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value as string | Blob);
                        }
                    }
                });


                for (var pair of formData.entries()) {
                    console.log(pair)
                }

                await api.post(`/${url}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken?.split("=")[1]}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                toast.success("Cadastro feito com sucesso");
                setTimeout(() => router.push(redirect));

            } else {
                await api.post(`/${url}`, data, {
                    headers: {
                        Authorization: `Bearer ${authToken?.split("=")[1]}`,
                        "Content-Type": "application/json",
                    },
                });

                toast.success("Cadastro feito com sucesso");
                setTimeout(() => router.push(redirect));
            }

        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            toast.error(errorMessage);
        }
    };

    return {
        create,
        loading,
        error
    };
};
