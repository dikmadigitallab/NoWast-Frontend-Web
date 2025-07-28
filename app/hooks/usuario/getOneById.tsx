'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";
import { useGetIDStore } from "@/app/store/getIDStore";

export const useGetOneUsuario = () => {

    const { id } = useGetIDStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getOneUsuario = async () => {

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
            if(!id) return;
            
            const response = await api.get<any>(`/users/${id}`, {
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

    useEffect(() => {
        getOneUsuario();
    }, [id]);

    return {
        getOneUsuario,
        loading,
        error,
        data,
        setData
    };
};