import { useAuthStore } from '@/app/store/storeApp';
import { toast } from 'react-toastify';
import { useState } from 'react';
import api from '../api';
import { redirect } from 'next/navigation';

export const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setId, setEmail, setDocumento, setUserType } = useAuthStore();

    const login = async (data: string, password: string) => {

        setIsLoading(true);
        setError(null);

        try {
            const clearFormatedData = data?.replace(/[.\-]/g, '')
            const response = await api.post('/auth', { document: clearFormatedData, password });
            document.cookie = `authToken=${response.data.data.token}; Path=/; Max-Age=3600; SameSite=Lax`;

            if (response.data.data.user.role.name === "Administrador Dikma") {
                setUserType("ADM_DIKMA");
            } else if (response.data.data.user.role.name === "Diretor Dikma") {
                setUserType("DIKMA_DIRECTOR");
            } else if (response.data.data.user.role.name === "Administrador Cliente") {
                setUserType("ADM_CLIENTE");
            } else if (response.data.data.user.role.name === "Gestor de Contrato") {
                setUserType("GESTAO");
            } else {
                setUserType("OPERATIONAL");
            }

            setId(response.data.data.user.id);
            setEmail(response.data.data.user.email);
            setDocumento(response.data.data.user.person.document);
            toast.success("Login realizado com sucesso!");

            setTimeout(() => {
                redirect("/");
            }, 1000);

        } catch (error) {
            toast.error("Documento ou senha inválidos!");
            setError((error as any)?.response?.data?.message || null);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
