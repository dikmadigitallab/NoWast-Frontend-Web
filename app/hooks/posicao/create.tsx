import { toast } from "react-toastify";
import { useState } from "react";
import { Logout } from "@/app/utils/logout";

import { useSectionStore } from "@/app/store/renderSection";
import api from "../api";
import { useRouter } from "next/navigation";

export const useCreateEmpresa = (url: string) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSection } = useSectionStore();

  const create = async (data: any) => {

    setError(null);
    setLoading(true);

    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

    if (!authToken) {
      setError("Token de autenticação não encontrado");
      Logout()
      return;
    }

    try {


      const response = api.post(`/${url}`, data, {
        headers: {
          Authorization: `Bearer ${authToken?.split("=")[1]}`,
          "Content-Type": "application/json",
        },
      })

      if (url === 'businessSector') {
        toast.success("BusinessSector criado com sucesso");
        setSection(2);
        return
      } else {
        toast.success("Empresa criada com sucesso");
        setTimeout(() => {
          setSection(1);
          router.push("/empresa/listagem");
        }, 1000);

      }

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
    create,
    loading,
    error,
  };
};