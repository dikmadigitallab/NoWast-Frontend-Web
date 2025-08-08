'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import api from "../api";

export const useGetOneServiceById = () => {

    const { id_service } = useGetIDStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getOneById = async () => {

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
            const response = await api.get<any>(`/service/${id_service}`, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });
            setData(response.data.data);
        } catch (error) {
            setError("Erro ao buscar dados");
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id_service) getOneById();
    }, [id_service]);

    return {
        getOneById,
        loading,
        error,
        data,
        setData
    };
};