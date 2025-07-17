import { toast } from "react-toastify";
import { useState } from "react";
import api from "../api";
import { Logout } from "@/app/utils/logout";

export const useCreateEmpresa = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmpresa = async (EmpresaData: any) => {

    setError(null);
    setLoading(true);

    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

    if (!authToken) {
      setError("Token de autenticação não encontrado");
      Logout()
      return;
    }

    try {
      const response = await api.post<any>("/Company", EmpresaData, {
        headers: {
          Authorization: `Bearer ${authToken?.split("=")[1]}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Empresa criada com sucesso");
      setLoading(false);

    } catch (error) {
      setLoading(false);
      
      const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    createEmpresa,
    loading,
    error,
  };
};