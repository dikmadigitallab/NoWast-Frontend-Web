"use client";

import Header from "@/app/components/header";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Empresa {
    id: number;
    name: string;
    image: string;
    status: string;
}

export default function Empresas() {

    const empresas: Empresa[] = [
        {
            id: 1,
            name: "Adcos",
            image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            status: "ativo"
        },
        {
            id: 2,
            name: "Acelormittal",
            image: "https://images.pexels.com/photos/1007023/pexels-photo-1007023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            status: "ativo"
        },
        {
            id: 3,
            name: "Nemak",
            image: "https://images.pexels.com/photos/256297/pexels-photo-256297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            status: "ativo"
        }
    ];

    return (
        <StyledMainContainer>
            <Box className="flex gap-2 mb-8">
                <a href='/' className="text-[#B9B9C3] text-[1.4rem] font-normal">Início</a>
                <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Empresas</h1>
            </Box>

            <Header />

            <Box className="w-full flex flex-col mt-3">

                <Box className="w-full flex flex-wrap flex-row justify-between">
                    {empresas.map(empresa => (
                        <Box key={empresa.id} className="md:w-[100%] lg:w-[32%] flex flex-col items-center justify-between overflow-hidden gap-2 p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                            <img
                                className="w-full h-[50%] object-cover transition duration-500 ease-in-out hover:scale-102 hover:rounded-sm"
                                src={empresa.image}
                                alt={empresa.name}
                            />
                            <span className='text-[#3b3b3b] text-[1.4rem] font-medium'>{empresa.name}</span>
                            <span className='text-[#5E5873] text-[.8rem] text-center'>
                                {empresa.name} é uma empresa parceira que busca excelência e inovação em seus processos. Clique para saber mais.
                            </span>
                            <Button
                                disabled={empresa.status === "inativo"}
                                sx={[buttonTheme, { width: "100%" }]}
                                variant="contained"
                                color="primary"
                                className="mt-4"
                                href="/dashboard/atividades"
                            >
                                {empresa.status === "inativo" ? "Pedir Acesso" : "Acessar"}
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </StyledMainContainer>
    );
}
