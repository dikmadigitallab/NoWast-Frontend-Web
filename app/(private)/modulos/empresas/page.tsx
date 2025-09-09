'use client';

import { useGet } from "@/app/hooks/crud/get/useGet";
import { useSelectModule } from "@/app/store/isSelectModule";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Alert, Box, Button, CircularProgress, Tooltip } from "@mui/material";
import { FaRegBuilding } from "react-icons/fa";

export default function Empresas() {

    const { SetisSelectModule } = useSelectModule();
    const { data: empresas, loading } = useGet({ url: "company" });

    console.log(empresas);

    const redirect = (empresaId: number) => {
        window.location.href = `/modulos/predios?empresa=${empresaId}`;
    };

    if (loading) {
        return (
            <StyledMainContainer>
                <Box className="flex gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
                    <a href='/' className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">Início</a>
                    <span className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">/</span>
                    <span className="text-[#5E5873] text-sm sm:text-base md:text-xl font-normal">Empresas</span>
                </Box>
                <Box className="flex justify-center items-center h-64">
                    <CircularProgress />
                </Box>
            </StyledMainContainer>
        );
    }

    return (
        <StyledMainContainer>
            <Box className="flex gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
                <a href='/' className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">Início</a>
                <span className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">/</span>
                <span className="text-[#5E5873] text-sm sm:text-base md:text-xl font-normal">Empresas</span>
            </Box>

            <Box className="w-full px-2 sm:px-4 md:px-0 flex flex-row flex-wrap justify-between items-start  gap-4 sm:gap-6">
                {
                    empresas?.map((empresa: any) => {
                        const isActive = empresa.deletedAt === null && empresa.person.deletedAt === null;

                        return (
                            <Box
                                key={empresa.id}
                                className="w-[25vw] flex flex-col items-center justify-between overflow-hidden p-4 rounded-sm border border-[#5e58731f] h-[350px] sm:h-[380px] md:h-[400px] transition-all duration-300 hover:shadow-md"
                            >

                                <Box className="w-full h-[30%]  flex items-center justify-center rounded-sm bg-[#f6f6f694]">
                                    <FaRegBuilding size={70} color="#a7a7a7" />
                                </Box>

                                <Box className="w-full h-[40%] p-4 flex flex-col items-center justify-start gap-1 ">
                                    <span className='text-[#3b3b3b] text-lg sm:text-xl md:text-2xl font-medium text-center'>
                                        {empresa.person.name}
                                    </span>
                                    {empresa.acronym && (
                                        <span className='text-[#6B7280] text-sm italic'>
                                            ({empresa.acronym})
                                        </span>
                                    )}
                                    {empresa.businessSector && (
                                        <span className='text-[#6B7280] text-xs italic'>
                                            Setor: {empresa.businessSector.description}
                                        </span>
                                    )}
                                    <Tooltip title={empresa.description} arrow>
                                        <span className='text-[#5E5873] text-xs sm:text-sm text-center line-clamp-3'>
                                            {empresa.description.substring(0, 90)}...
                                        </span>
                                    </Tooltip>
                                </Box>

                                <Button
                                    onClick={() => redirect(empresa.id)}
                                    disabled={!isActive}
                                    sx={[
                                        buttonTheme,
                                        {
                                            width: "100%",
                                            fontSize: "0.875rem",
                                            opacity: isActive ? 1 : 0.6
                                        }
                                    ]}
                                    variant="contained"
                                    color="primary"
                                >
                                    {!isActive ? "Pedir Acesso" : "Acessar"}
                                </Button>
                            </Box>
                        );
                    })
                }
            </Box>
        </StyledMainContainer>
    );
}