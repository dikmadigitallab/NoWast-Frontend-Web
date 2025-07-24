import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";
import api from "../api";
import { useRouter } from "next/navigation";

export const useUpdateContrato = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContrato = async (data: any) => {

    setError(null);
    setLoading(true);

    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

    if (!authToken) {
      setError("Token de autenticação não encontrado");
      Logout()
      return;
    }

    try {

      const response = api.post(`/contract`, data, {
        headers: {
          Authorization: `Bearer ${authToken?.split("=")[1]}`,
          "Content-Type": "application/json",
        },
      })


      toast.success("Contrato criada com sucesso");
      setLoading(false);

      setTimeout(() => {
        router.push("/contrato/listagem");
      }, 1000);

    } catch (error) {
      setLoading(false);
      const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    updateContrato,
    loading,
    error,
  };
};