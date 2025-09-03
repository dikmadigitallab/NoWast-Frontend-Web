'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

export const useGetDashboardLocation = ({ startDate = null, endDate = null }: any) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sectorActivities, setSectorActivities] = useState<any>(null);
    const [environmentActivities, setEnvironmentActivities] = useState<any>(null);

    const getDashboardLocation = async () => {
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

            if (startDate !== null) params.append("startDate", startDate.trim());
            if (endDate !== null) params.append("endDate", String(endDate).trim());

            const url = `/dashboard/locations?${params.toString()}`;

            const response = await api.get<any>(url,
                {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setEnvironmentActivities(response.data.data.environmentActivities);
            setSectorActivities(response.data.data.sectorActivities);

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
            getDashboardLocation();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [startDate, endDate]);

    return {
        getDashboardLocation,
        loading,
        error,
        sectorActivities,
        environmentActivities
    };
};