"use client";

import Header from "@/app/components/userHeader";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useSelectModule } from "@/app/store/isSelectModule";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { Box, Button } from "@mui/material";

export default function Predios() {

    const { SetisSelectModule } = useSelectModule();
    const { data: predios } = useGet({ url: "building" });

    const redirect = () => {
        window.location.href = "/dashboard/atividades";
        SetisSelectModule(true);
    };

    return (
        <StyledMainContainer>
            <Box className="flex gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
                <span className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">
                    Prédios
                </span>
                <span className="text-[#B9B9C3] text-sm sm:text-base md:text-xl font-normal">
                    /
                </span>
                <span className="text-[#5E5873] text-sm sm:text-base md:text-xl font-normal">
                    Listagem
                </span>
            </Box>
            <Header />
            <Box className="w-full px-2 sm:px-4 md:px-0">
                <Box className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {predios?.map((predio: any) => {

                        const image = predio.buildingFiles[0]?.file?.url;
                        const status = predio.deletedAt ? "inativo" : "ativo";

                        return (
                            <Box
                                key={predio.id}
                                className="w-full flex flex-col items-center justify-between overflow-hidden gap-3 p-4 rounded-sm border border-[#5e58731f] h-[350px] sm:h-[380px] md:h-[400px] transition-all duration-300 hover:shadow-md"
                            >
                                <img
                                    className="w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover rounded-sm transition duration-500 ease-in-out hover:scale-102"
                                    src={image}
                                    alt={predio.name}
                                />
                                <span className="text-[#3b3b3b] text-lg sm:text-xl md:text-2xl font-medium text-center">
                                    {predio.name}
                                </span>
                                <span className="text-[#5E5873] text-xs sm:text-sm text-center line-clamp-3">
                                    {predio.description ||
                                        `O prédio ${predio.name} é fundamental no processo industrial.`}
                                </span>
                                <Button
                                    onClick={redirect}
                                    disabled={status === "inativo"}
                                    sx={[
                                        buttonTheme,
                                        {
                                            width: "100%",
                                            marginTop: "auto",
                                            fontSize: "0.875rem",
                                            padding: "0.5rem",
                                        },
                                    ]}
                                    variant="contained"
                                    color="primary"
                                >
                                    {status === "inativo" ? "Pedir Acesso" : "Acessar"}
                                </Button>
                            </Box>
                        );
                    })}
                </Box>

            </Box>
        </StyledMainContainer>
    );
}
