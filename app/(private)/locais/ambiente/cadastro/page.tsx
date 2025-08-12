"use client";

import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useSectionStore } from "@/app/store/renderSection";
import { IoIosArrowForward } from "react-icons/io";
import { Box, Button, Modal} from "@mui/material";
import FormDadosGerais from "./forms/gerais";
import { useRouter } from "next/navigation";
import FormServicos from "./forms/servico";
import { useState } from "react";

export default function Ambiente() {

    const router = useRouter();
    const { section } = useSectionStore();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/ambiente/listagem');
    };

    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5 p-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Ambiente</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Cadastro</h1>
                    {section === 1 && <h1 className="text-[#5E5873] text-[1.4rem] font-normal">/ Dados Gerais</h1>}
                    {section === 2 && <h1 className="text-[#5E5873] text-[1.4rem] font-normal">/ Seviço</h1>}
                </Box>

                <Box className="w-[100%] flex items-center h-[100px]">
                    {[1, 2].map((step) => (
                        <Box
                            key={step}
                            className={`
                            w-[25%] h-[100%] flex flex-row items-center justify-between p-5 rounded-md 
                            ${section === step ? "bg-[#00000003]" : ""}`}>
                            <Box className="h-[100%] items-center flex flex-row gap-5 w-[80%]">
                                <Box
                                    style={{ backgroundColor: section === step ? "#3ABA8A" : "#f7f7f7", color: step === section ? "#fff" : "" }}
                                    className={`w-[70px] h-full flex justify-center items-center rounded-md text-[#3ABA8A] font-semibold`}>
                                    {step}
                                </Box>
                                <h1 className="text-[#43BC8B] font-semibold">
                                    {step === 1 ? "Dados Gerais" : "Serviço"}
                                </h1>
                            </Box>
                            <IoIosArrowForward />
                        </Box>
                    ))}
                </Box>

                {section === 1 && (<FormDadosGerais />)}
                {section === 2 && (<FormServicos />)}

            </Box>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}