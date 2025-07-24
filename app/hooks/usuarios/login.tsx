import { useAuthStore } from '@/app/store/storeApp';
import { toast } from 'react-toastify';
import { useState } from 'react';
import api from '../api';
import { redirect } from 'next/navigation';
import { useSelectModule } from '@/app/store/isSelectModule';

export const useLogin = () => {

    const [error, setError] = useState(null);
    const { SetisSelectModule } = useSelectModule();
    const [isLoading, setIsLoading] = useState(false);
    const { setId, setEmail, setDocumento, setUserType } = useAuthStore();

    const login = async (email: string, password: string) => {

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth', { email, password });
            document.cookie = `authToken=${response.data.data.token}; Path=/; Max-Age=3600; SameSite=Lax`;

            // setUserType(response.data.data.user.person.name);
            setUserType("GESTAO");
            setId(response.data.data.user.id);
            setEmail(response.data.data.user.email);
            setDocumento(response.data.data.user.person.document);

            toast.success("Login realizado com sucesso!");
            SetisSelectModule(false);
            
            setTimeout(() => {
                redirect("/");
            }, 1000);

        } catch (error) {
            toast.error("Usuário ou senha inválidos!");
            setError((error as any)?.response?.data?.message || null);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
