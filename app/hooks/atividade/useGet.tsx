'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";
import { useGetIDStore } from "@/app/store/getIDStore";


export interface UseGetParams {
    page?: number,
    pageSize?: number | null,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    responsibleManagerId?: number | null
    buildingId?: number | null,
    environmentId?: number | null
}

export const useGetServiceEnvironment = ({ page = 1, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null }: UseGetParams) => {

    const { id } = useGetIDStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const get = async () => {
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
            const params = new URLSearchParams();

            params.append("disablePagination", "true");
            params.append("page", String(page));

            if (query !== null) params.append("query", query.trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (positionId !== null) params.append("positionId", String(positionId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (responsibleManagerId !== null) params.append("responsibleManagerId", String(responsibleManagerId).trim());
            if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
            if (id !== null) params.append("environmentId", String(environmentId).trim());

            const paramUrl = `/service?${params.toString()}`;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });


            const refactorData = response.data.data.items.map((item: any) => item.serviceItems);
            setData(refactorData[0]);

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
        const delayDebounce = setTimeout(() => {
            get();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [query, supervisorId, positionId, managerId, page, pageSize, responsibleManagerId, buildingId, environmentId]);


    return {
        loading,
        error,
        data
    };
};