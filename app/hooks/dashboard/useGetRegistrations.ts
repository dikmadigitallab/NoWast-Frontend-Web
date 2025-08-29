'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

export const useGetDashboardRegistrations = ({ startDate = null, endDate = null }: any) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dailyStats, setDailyStats] = useState<any>(null);
    const [usersByPosition, setUsersByPosition] = useState<any>(null);

    const getDashboardRegistration = async () => {
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

            const url = `/dashboard/registrations/user?${params.toString()}`;

            const response = await api.get<any>(url,
                {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setDailyStats(response.data.data.dailyStats);
            setUsersByPosition(response.data.data.usersByPosition);
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
            getDashboardRegistration();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [startDate, endDate]);

    return {
        getDashboardRegistration,
        loading,
        error,
        dailyStats,
        usersByPosition
    };
};

