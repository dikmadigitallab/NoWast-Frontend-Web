'use client';

import { Box } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAuthStore } from "../store/storeApp";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {

    const { userType } = useAuthStore();
    const pathname = usePathname();

    const userTypes = {
        DEFAULT: '',
        ADM_DIKMA: 'Administrador Dikma',
        GESTAO: 'Gestão',
        CLIENTE_DIKMA: 'Cliente Dikma',
        DIKMA_DIRETORIA: 'Diretoria Dikma',
    }

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !userType) return null;

    return (
        <Box className="flex flex-col gap-[30px] mb-3">
            <Box className="flex flex-row justify-between items-center border-1 border-[#5e58731f] p-[15px] rounded-sm">
                <Box className="flex flex-col">
                    <h1 className="text-[#5E5873] text-[2.4rem] font-medium">Olá, Gabriel!</h1>
                    <p className="text-[#00b288] text-[1.2rem] font-semibold animate-pulse">{userTypes[userType!]}</p>
                    <p className="text-[#5E5873] text-[1rem]">Escolha uma das empresas para iniciar sua jornada com a Dikma.</p>
                </Box>
                {pathname !== '/' && <a href="/"><IoIosCloseCircleOutline size={40} className="text-[#5E5873] text-[2rem] cursor-pointer" /></a>}
            </Box>
        </Box>
    )
}
