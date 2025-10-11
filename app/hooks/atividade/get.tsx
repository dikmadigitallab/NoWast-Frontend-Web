'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import api from "../api";
import { filterStatusActivity } from "@/app/utils/statusActivity";
import { useSectionStore } from "@/app/store/renderSection";


export interface UseGetParams {
    pageNumber?: number | null,
    pageSize?: number | null,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    buildingId?: number | null,
    environmentId?: number | null,
    disablePagination?: boolean | null
    startDate?: string | null,
    endDate?: string | null
    sectorId?: string | null
    approvalStatus?: string | null
}

export const useGetActivity = ({ approvalStatus = null, sectorId = null, startDate = null, endDate = null, disablePagination = null, pageNumber = null, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, buildingId = null, environmentId = null }: UseGetParams) => {

    const [data, setData] = useState<any>(null);
    const { setIdService, setId } = useGetIDStore();
    const { setSection } = useSectionStore();
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

            if (pageNumber !== null) params.append("pageNumber", String(pageNumber).trim());
            if (disablePagination !== null) params.append("disablePagination", String(disablePagination).trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (startDate !== null) params.append("startDate", String(startDate).trim());
            if (endDate !== null) params.append("endDate", String(endDate).trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (positionId !== null) params.append("positionId", String(positionId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
            if (environmentId !== null) params.append("environmentId", String(environmentId).trim());
            if (query !== '' && query !== null) params.append("query", query.trim());
            if (sectorId !== '' && sectorId !== null) params.append("sectorId", String(sectorId).trim());
            if (approvalStatus !== '' && approvalStatus !== null) params.append("approvalStatus", String(approvalStatus).trim());

            const paramUrl = `/activity?${params.toString()}`;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${authToken.split("=")[1]}`,
                    "Content-Type": "application/json",
                },
            });

            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                description: item.description,
                activityTypeEnum: item.activityTypeEnum === "RECURRING" ? "Recorrente" : "Não Recorrente",
                environment: item.environment?.name,
                dimension: item.environment?.areaM2,
                environmentDetail: {
                    id: item.environment?.id,
                    name: item.environment?.name,
                    areaM2: item.environment?.areaM2,
                    sector: {
                        id: item.environment?.sector?.id,
                        name: item.environment?.sector?.name,
                    },
                    building: {
                        id: item.environment?.sector?.building?.id,
                        name: item.environment?.sector?.building?.name,
                    }
                },
                supervisor: item?.supervisor?.person?.name,
                manager: item?.manager?.person?.name,
                supervisorDetails: {
                    id: item?.supervisor?.id,
                    email: item?.supervisor?.email,
                    phone: item?.supervisor?.phone,
                    personName: item?.supervisor?.person?.name,
                },
                managerDetails: {
                    id: item?.manager?.id,
                    email: item?.manager?.email,
                    phone: item?.manager?.phone,
                    personName: item?.manager?.person?.name,
                },
                statusEnum: filterStatusActivity(item?.statusEnum),
                approvalStatus: filterStatusActivity(item?.approvalStatus),
                approvalDate: item?.approvalDate ? new Date(item.approvalDate).toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : null,
                approvalUpdatedByUserName: item?.approvalUpdatedByUser?.person?.name,
                ppe: item?.ppes, // API returns `ppes`
                tools: item?.tools,
                products: item?.products,
                userActivities: item?.userActivities || [],
                participantsActive: (item?.userActivities || [])
                    .filter((ua: any) => ua?.user?.status === 'ACTIVE')
                    .map((ua: any) => ({ id: ua.user?.id, name: ua.user?.person?.name })),
                transports: item?.transports,
                activityFiles: item?.activityFiles || [],
                checklists: item?.checklists || [],
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
        setSection(1);
        const delayDebounce = setTimeout(() => {
            get();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [approvalStatus, sectorId, startDate, endDate, query, supervisorId, positionId, managerId, pageNumber, pageSize, managerId, buildingId, environmentId]);


    return {
        loading,
        error,
        data,
        pages
    };
};