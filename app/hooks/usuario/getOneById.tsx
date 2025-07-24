'use client';

import { Logout } from "@/app/utils/logout";
import { useState } from "react";
import api from "../api";

export const useGetOneUsuario = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getOneUsuario = async (id: string | number) => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            setLoading(false);
            return;
        }

        try {
            const response = await api.get<any>(`/building/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });
            setData(response.data.data);
        } catch (error) {
            setError("Erro ao buscar usuarios");
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };


    return {
        getOneUsuario,
        loading,
        error,
        data,
        setData
    };
};