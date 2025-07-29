'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../../api";

export const useGetPredio = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getPredio = async () => {
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
            const response = await api.get<any>("/building?disablePagination=true", {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data.data.items);
        } catch (error) {
            setError("Erro ao buscar setores empresariais");
            if (error instanceof Error) {
                console.error("Error fetching business sectors:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPredio();
    }, []);

    return {
        getPredio,
        loading,
        error,
        data,
        setData
    };
};