'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../../api";
import { useGetIDStore } from "@/app/store/getIDStore";

export const useGetOnePessoa = () => {

    const { id } = useGetIDStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const getOnePessoa = async () => {

        setError(null);
        setLoading(true);
        console.log(id)

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
            setLoading(false);
            return;
        }

        try {
            const response = await api.get<any>(`/person/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response)
            setData(response.data.data);
        } catch (error) {
            setError("Erro ao buscar pessoas");
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) getOnePessoa();
    }, [id]);


    return {
        getOnePessoa,
        loading,
        error,
        data,
        setData
    };
};