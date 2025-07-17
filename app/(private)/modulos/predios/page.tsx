"use client";

import Header from "@/app/components/userHeader";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";

interface Predio {
    id: number;
    name: string;
    image: string;
    status: string;
}

export default function Predios() {

    const predios: Predio[] = [
        {
            id: 1,
            name: "Coqueria",
            image: "https://images.pexels.com/photos/32932494/pexels-photo-32932494.jpeg",
            status: "ativo"
        },
        {
            id: 2,
            name: "Sinterização",
            image: "https://images.pexels.com/photos/32979713/pexels-photo-32979713/free-photo-of-ponte-exterior-amarela-moderna-em-berlim.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            status: "ativo"
        },
        {
            id: 3,
            name: "Auto Forno",
            image: "https://images.pexels.com/photos/3730670/pexels-photo-3730670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            status: "ativo"
        }
    ];

    return (
        <StyledMainContainer>
            <Box className="flex gap-2 mb-8">
                <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédios</h1>
                <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Listagem</h1>
            </Box>

            <Header />

            <Box className="w-full flex flex-col mt-8">
                <Box className="w-full flex flex-wrap flex-row justify-between">
                    {predios.map(predio => (
                        <Box key={predio.id} className="md:w-[100%] lg:w-[32%] flex flex-col items-center justify-between overflow-hidden gap-2 p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                            <img
                                className="w-full h-[50%] object-cover transition duration-500 ease-in-out hover:scale-102 hover:rounded-sm"
                                src={predio.image}
                                alt={predio.name}
                            />
                            <span className='text-[#3b3b3b] text-[1.4rem] font-medium'>{predio.name}</span>
                            <span className='text-[#5E5873] text-[.8rem] text-center'>
                                O prédio {predio.name} é fundamental no processo industrial. Clique para saber mais e acessar detalhes operacionais.
                            </span>
                            <Button
                                disabled={predio.status === "inativo"}
                                sx={[buttonTheme, { width: "100%" }]}
                                variant="contained"
                                color="primary"
                                className="mt-4"
                                href="/dashboard/atividades"
                            >
                                {predio.status === "inativo" ? "Pedir Acesso" : "Acessar"}
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </StyledMainContainer>
    );
}
