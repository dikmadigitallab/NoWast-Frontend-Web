'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";
import { useAuthStore } from "@/app/store/storeApp";

export const useGetUsuario = ({ disablePagination = null, pageNumber = null, pageSize = null, page = 1, query = null, supervisorId = null, position = null, managerId = null }: UseGetUsuarioParams) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);
    const { userInfo } = useAuthStore();
    const [pages, setPages] = useState({ pageNumber: 0, pageSize: 0, totalItems: 0, totalPages: 0 });


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

            const params = new URLSearchParams();

            if (disablePagination !== null) params.append("disablePagination", String(disablePagination).trim());
            if (pageNumber !== null) params.append("pageNumber", String(pageNumber).trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (query !== null && query !== '') params.append("query", query.trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (userInfo.contractId) params.append("contractId", String(userInfo.contractId).trim());

            const url = `/users?${params.toString()}`;

            const response = await api.get<any>(url,
                {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                personId: item.person?.id,
                name: item.person?.name,
                supervisor: item?.supervisor?.person?.name,
                manager: item?.manager?.person?.name,
                email: item?.email,
                status: item.status,
                userType: item.userType,
                role: item.role?.name,
                position: item.position?.name,
                endDate: item.contract?.endDate,
                startDate: item.contract?.startDate,
                epis: item.ppes,
                transports: item.transports,
                products: item.products,
                img: item.userFiles[0]?.file.url,
            })) || [];

            setPages({
                pageNumber: response?.data?.data?.pageNumber,
                pageSize: response?.data?.data?.pageSize,
                totalItems: response?.data?.data?.totalCount,
                totalPages: response?.data?.data?.totalPages,
            });
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
        const delayDebounce = setTimeout(() => {
            getUsuario();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [query, supervisorId, position, managerId, page, pageNumber, disablePagination, pageSize, pageSize]);

    return {
        pages,
        getUsuario,
        loading,
        error,
        users,
        data
    };
};
