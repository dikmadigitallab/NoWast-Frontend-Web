'use client';

import { Box } from "@mui/material";
import { useAuthStore } from "../store/storeApp";
import { useEffect, useState } from "react";

export default function UserHeader() {
    const { userType, userInfo } = useAuthStore();

    const userTypes = {
        DEFAULT: '',
        ADM_DIKMA: 'Administrador Dikma',
        GESTAO: 'Gestão',
        ADM_CLIENTE: 'Administrador(a) Cliente Dikma',
        DIKMA_DIRECTOR: 'Diretoria Dikma',
        OPERATIONAL: 'Operacional'
    }

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !userType) return null;

    return (
        <Box className="flex flex-col gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
            <Box className="flex flex-row justify-between items-center border border-[#5e58731f] p-3 sm:p-4 md:p-6 rounded-sm">
                <Box className="flex flex-col gap-1 sm:gap-2">
                    <h1 className="text-[#5E5873] text-xl sm:text-2xl md:text-3xl font-medium">
                        Olá, {userInfo?.name}!
                    </h1>
                    <p className="text-[#00b288] text-base sm:text-lg md:text-xl font-semibold animate-pulse">
                        {userTypes[userType!]}
                    </p>
                    <p className="text-[#5E5873] text-sm sm:text-base">
                        Escolha uma das empresas para iniciar sua jornada com a Dikma.
                    </p>
                </Box>
            </Box>
        </Box>
    )
}