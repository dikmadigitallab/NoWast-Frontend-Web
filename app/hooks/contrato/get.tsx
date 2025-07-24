'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

export const useGetContratos = (withoutBuildings?: boolean) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getContrato = async () => {
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
            const response = await api.get<any>(`/contract?disablePagination=true&withoutBuildings=${withoutBuildings}`, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data.data.items);
        } catch (error) {
            setError("Erro ao buscar contratos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getContrato();
    }, []);

    return {
        getContrato,
        loading,
        error,
        data
    };
};