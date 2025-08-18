"use client";

import Header from "@/app/components/userHeader";
import { useSelectModule } from "@/app/store/isSelectModule";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";

interface Empresa {
    id: number;
    name: string;
    image: string;
    status: string;
}

export default function Empresas() {
    const { SetisSelectModule } = useSelectModule();

    const redirect = () => {
        window.location.href = '/modulos/predios';
        SetisSelectModule(true);
    }

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
            <Box className="flex gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
                <a href='/' className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">Início</a>
                <span className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">/</span>
                <span className="text-[#5E5873] text-sm sm:text-base md:text-xl font-normal">Empresas</span>
            </Box>

            <Header />

            <Box className="w-full px-2 sm:px-4 md:px-0">
                <Box className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {empresas.map(empresa => (
                        <Box
                            key={empresa.id}
                            className="w-full flex flex-col items-center justify-between overflow-hidden gap-3 p-4 rounded-sm border border-[#5e58731f]
                            h-[350px] sm:h-[380px] md:h-[400px]"
                        >
                            <img
                                className="w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover transition duration-500 ease-in-out hover:scale-102 hover:rounded-sm"
                                src={empresa.image}
                                alt={empresa.name}
                            />
                            <span className='text-[#3b3b3b] text-lg sm:text-xl md:text-2xl font-medium text-center'>
                                {empresa.name}
                            </span>
                            <span className='text-[#5E5873] text-xs sm:text-sm text-center line-clamp-3'>
                                {empresa.name} é uma empresa parceira que busca excelência e inovação em seus processos. Clique para saber mais.
                            </span>
                            <Button
                                onClick={redirect}
                                disabled={empresa.status === "inativo"}
                                sx={[
                                    buttonTheme,
                                    {
                                        width: "100%",
                                        marginTop: "auto",
                                        fontSize: "0.875rem",
                                        padding: "0.5rem"
                                    }
                                ]}
                                variant="contained"
                                color="primary"
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