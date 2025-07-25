'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

export const useGetUsuario = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);

    const getUsuario = async () => {
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
            const response = await api.get<any>("/users?disablePagination=true", {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });


            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                name: item.person?.name,
                supervisor: item.supervisor?.email,
                manager: item.manager?.email,
                email: item.email,
                status: item.status,
                userType: item.userType,
                role: item.role?.name,
                position: item.position?.name,
                endDate: item.contract?.endDate,
                startDate: item.contract?.startDate,
                epis: item.ppes,
                transports: item.transports,
                products: item.products
            })) || [];

            setUsers(response.data.data.items);
            setData(refactory);
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
        getUsuario();
    }, []);

    return {
        getUsuario,
        loading,
        error,
        users,
        data
    };
};