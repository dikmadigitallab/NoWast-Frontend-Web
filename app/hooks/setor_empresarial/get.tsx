'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

type SetorEmpresarial = {
    id: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

type SetorEmpresarialResponse = {
    data: {
        items: SetorEmpresarial[];
        totalCount: number;
        pageSize: number;
        pageNumber: number;
        count: number;
        totalPages: number;
        isFirstPage: boolean;
        isLastPage: boolean;
    }
};

export const useGetSetorEmpresarial = () => {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SetorEmpresarialResponse | null>(null);

    const getSetorEmpresarial = async () => {
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
            const response = await api.get<SetorEmpresarialResponse>("/businessSector", {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            setData(response.data);
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
        getSetorEmpresarial();
    }, []);

    return {
        getSetorEmpresarial,
        loading,
        error,
        data,
        setData
    };
};