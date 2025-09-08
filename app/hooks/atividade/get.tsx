'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import api from "../api";
import { filterStatusActivity } from "@/app/utils/statusActivity";


export interface UseGetParams {
    pageNumber?: number | null,
    pageSize?: number | null,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    responsibleManagerId?: number | null
    buildingId?: number | null,
    environmentId?: number | null,
    disablePagination?: boolean | null
    startDate?: string | null,
    endDate?: string | null
}

export const useGetActivity = ({ startDate = null, endDate = null, disablePagination = null, pageNumber = null, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null }: UseGetParams) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { setIdService, setId } = useGetIDStore();
    const [data, setData] = useState<any>(null);
    const [pages, setPages] = useState({ pageNumber: 0, pageSize: 0, totalItems: 0, totalPages: 0 });

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

            if (pageNumber !== null) params.append("pageNumber", String(pageNumber).trim());
            if (disablePagination !== null) params.append("disablePagination", String(disablePagination).trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (startDate !== null) params.append("startDate", String(startDate).trim());
            if (endDate !== null) params.append("endDate", String(endDate).trim());
            if (query !== null) params.append("query", query.trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (positionId !== null) params.append("positionId", String(positionId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (responsibleManagerId !== null) params.append("responsibleManagerId", String(responsibleManagerId).trim());
            if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
            if (environmentId !== null) params.append("environmentId", String(environmentId).trim());

            const paramUrl = `/activity?${params.toString()}`;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                activityTypeEnum: item.activityTypeEnum === "RECURRING" ? "Recorrente" : "Não Recorrente",
                environment: item.environment?.name,
                dimension: item.environment?.areaM2,
                supervisor: item?.supervisor?.person?.name,
                manager: item?.manager?.person?.name,
                statusEnum: filterStatusActivity(item?.statusEnum),
                approvalStatus: filterStatusActivity(item?.approvalStatus),
                ppe: item?.ppe,
                tools: item?.tools,
                products: item?.products,
                userActivities: item?.userActivities || [],
                transports: item?.transports,
                dateTime: new Date(item.dateTime).toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
            })) || [];

            setPages({
                pageNumber: response?.data?.data?.pageNumber,
                pageSize: response?.data?.data?.pageSize,
                totalItems: response?.data?.data?.totalCount,
                totalPages: response?.data?.data?.totalPages,
            });
            setData(refactory);
        } catch (error) {
            setError("Erro ao buscar setores empresariais");
            if (error instanceof Error) {
                console.error("Error fetching business sectors:", error.message);
            }
        } finally {
            setLoading(false);
            setIdService(null)
            setId(null)
        }
    };

    useEffect(() => {
        setLoading(true);

        const delayDebounce = setTimeout(() => {
            get();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [startDate, endDate, query, supervisorId, positionId, managerId, pageNumber, pageSize, responsibleManagerId, buildingId, environmentId]);


    return {
        loading,
        error,
        data,
        pages
    };
};