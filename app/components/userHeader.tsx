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

    console.log(userInfo);

    return (
        <Box className="flex flex-col gap-[30px] mb-3">
            <Box className="flex flex-row justify-between items-center border-1 border-[#5e58731f] p-[15px] rounded-sm">
                <Box className="flex flex-col">
                    <h1 className="text-[#5E5873] text-[1.6rem] font-medium">Olá, {userInfo?.name}!</h1>
                    <p className="text-[#00b288] text-[1.2rem] font-semibold animate-pulse">{userTypes[userType!]}</p>
                    <p className="text-[#5E5873] text-[1rem]">Escolha uma das empresas para iniciar sua jornada com a Dikma.</p>
                </Box>
            </Box>
        </Box>
    )
}
