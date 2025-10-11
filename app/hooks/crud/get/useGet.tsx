'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../../api";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useAuthStore } from "@/app/store/storeApp";


export interface UseGetParams {
    url: string,
    page?: number,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    responsibleManagerId?: number | null
    buildingId?: number | null,
    environmentId?: number | null
    pageNumber?: number | null,
    pageSize?: number | null,
    disablePagination?: boolean | null
    includeDeleted?: boolean | null
}

export const useGet = ({ url, page = 1, disablePagination = null, pageNumber = null, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null, includeDeleted = false }: UseGetParams) => {

    const { userInfo } = useAuthStore();
    const { setIdService } = useGetIDStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
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

            if (disablePagination !== null) params.append("disablePagination", String(disablePagination).trim());
            if (pageNumber !== null) params.append("pageNumber", String(pageNumber).trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (query !== null && query !== '') params.append("query", query.trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (positionId !== null) params.append("positionId", String(positionId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (responsibleManagerId !== null) params.append("responsibleManagerId", String(responsibleManagerId).trim());
            if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
            if (environmentId !== null) params.append("environmentId", String(environmentId).trim());
            if (userInfo.contractId) params.append("contractId", String(userInfo.contractId).trim());
            if (includeDeleted) params.append("includeDeleted", String(includeDeleted).trim());

            const paramUrl = `/${url}?${params.toString()}`;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            if (url === "service") {
                const refactorData = response.data.data.items.map((item: any) => item.serviceItems);
                setData(refactorData[0]);
            } else if (url === "environment") {

                const refactorData = response.data.data.items.map((item: any) => {
                    return {
                        id: item?.id,
                        name: item?.name,
                        description: item?.description,
                        areaM2: item?.areaM2,
                        deletedAt: item?.deletedAt,
                        setor: {
                            id: item?.sector?.id,
                            name: item?.sector?.name,
                            description: item?.sector?.description,
                            areaM2: item?.sector?.radius
                        },
                        predio: {
                            id: item?.sector?.building?.id,
                            name: item?.sector?.building?.name,
                            description: item?.sector?.building?.description,
                            areaM2: item?.sector?.building?.radius
                        },
                        servicos: item?.services?.map((service: any) => ({
                            id: service?.id,
                            name: service?.name,
                            description: service?.description
                        })) || [],
                        epis: item?.ppes?.map((ppe: any) => ({
                            id: ppe?.id,
                            name: ppe?.name,
                            description: ppe?.description
                        })) || []
                    };
                });

                setPages({
                    pageNumber: response?.data?.data?.pageNumber,
                    pageSize: response?.data?.data?.pageSize,
                    totalItems: response?.data?.data?.totalCount,
                    totalPages: response?.data?.data?.totalPages,
                });
                setData(refactorData);
            }

            else {
                setPages({
                    pageNumber: response?.data?.data?.pageNumber,
                    pageSize: response?.data?.data?.pageSize,
                    totalItems: response?.data?.data?.totalCount,
                    totalPages: response?.data?.data?.totalPages,
                });
                setData(response.data.data.items);
            }

        } catch (error) {
            setError("Erro ao buscar setores empresariais");
            if (error instanceof Error) {
                console.error("Error fetching business sectors:", error.message);
            }
        } finally {
            setLoading(false);
            setIdService(null)
        }
    };


    useEffect(() => {
        setLoading(true);

        const delayDebounce = setTimeout(() => {
            get();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [pageNumber, disablePagination, pageSize, query, supervisorId, positionId, managerId, page, pageSize, responsibleManagerId, buildingId, environmentId, includeDeleted]);


    return {
        pages,
        loading,
        error,
        data
    };
};