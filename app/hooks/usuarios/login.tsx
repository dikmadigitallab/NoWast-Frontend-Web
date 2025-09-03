import { useAuthStore } from '@/app/store/storeApp';
import { toast } from 'react-toastify';
import { useState } from 'react';
import api from '../api';
import { redirect } from 'next/navigation';
import axios from 'axios';

export const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setId, setUserInfo, setUserType } = useAuthStore();



    const login = async (data: string, password: string) => {

        setIsLoading(true);
        setError(null);

        try {
            const clearFormatedData = data?.replace(/[.\-]/g, '')
            const response = await axios.post('https://nowastev2.api.dikmadigital.com.br/auth', { document: clearFormatedData, password});
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

            const userInfo = {
                name: response.data.data.user.person.name,
                email: response.data.data.user.person.emails[0]?.email,
                document: response.data.data.user.person.document,
                position: response.data.data.user.role.name,
                contractId: response.data.data.user.contractId
            }

            setUserInfo(userInfo);
            setId(response.data.data.user.id);
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

 
/* 
    const login = async (data: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
        const clearFormatedData = data?.replace(/[.\-]/g, '');

        const response = await fetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                document: clearFormatedData,
                password,
            }),
            credentials: "include", // garante envio/recebimento de cookies
        });

        if (!response.ok) {
            throw new Error("Erro ao realizar login");
        }

        const result = await response.json();

        // salva token no cookie manualmente
        document.cookie = `authToken=${result.data.token}; Path=/; Max-Age=3600; SameSite=Lax`;

        if (result.data.user.role.name === "Administrador Dikma") {
            setUserType("ADM_DIKMA");
        } else if (result.data.user.role.name === "Diretor Dikma") {
            setUserType("DIKMA_DIRECTOR");
        } else if (result.data.user.role.name === "Administrador Cliente") {
            setUserType("ADM_CLIENTE");
        } else if (result.data.user.role.name === "Gestor de Contrato") {
            setUserType("GESTAO");
        } else {
            setUserType("OPERATIONAL");
        }

        const userInfo = {
            name: result.data.user.person.name,
            email: result.data.user.person.emails[0]?.email,
            document: result.data.user.person.document,
            position: result.data.user.role.name,
            contractId: result.data.user.contractId,
        };

        setUserInfo(userInfo);
        setId(result.data.user.id);
        toast.success("Login realizado com sucesso!");

        setTimeout(() => {
            redirect("/");
        }, 1000);

    } catch (error) {
        toast.error("Documento ou senha inválidos!");
        setError((error as any)?.message || null);
    } finally {
        setIsLoading(false);
    }
};


 */

    return { login, isLoading, error };
};
