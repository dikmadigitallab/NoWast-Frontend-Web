"use client";

import { StyledMainContainer } from "@/app/styles/container/container";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import FormEndereco from "./forms/endereco";
import FormPessoas from "./forms/pessoais";
import FormTelefones from "./forms/telefones";
import FormEmails from "./forms/emails";
import { useSectionStore } from "@/app/store/renderSection";


export default function CadastroPessoa() {


    const router = useRouter();
    const { setSection, section } = useSectionStore();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleBack = () => {
        setSection(section - 1);
    }
    const handleNext = () => {
        setSection(section + 1);
    }

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/pessoa/listagem');
    };


    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">

                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoa</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-[100%] flex items-center h-[100px]">
                    {[1, 2, 3, 4].map((step) => (
                        <Box
                            key={step}
                            onClick={() => setSection(step)}
                            className={`
                            w-[25%] h-[100%] flex flex-row items-center justify-between p-5 rounded-md  cursor-pointer 
                            ${section !== step ? "opacity-50" : "opacity-100"}
                            ${section !== step ? "pointer-events-none" : ""}
                            ${section === step ? "bg-[#00000003]" : ""}`}>
                            <Box className="h-[100%] items-center flex flex-row gap-5 w-[80%]">
                                <Box style={{ background: section === step ? "#3ABA8A" : "", color: section === step ? "#fff" : "#3ABA8A" }}
                                    className={`w-[70px] h-full flex justify-center items-center rounded-md  font-semibold border-1  border-[#3ABA8A]`}>
                                    {step}
                                </Box>
                                <h1
                                    className="text-[#43BC8B] font-semibold">
                                    {step === 1 ? "Dados Gerais" : step === 2 ? "Endereços" : step === 3 ? "Telefones" : "Emails"}
                                </h1>
                            </Box>
                            <IoIosArrowForward />
                        </Box>
                    ))}
                </Box>

                <Box className="flex flex-col gap-5">

                    {section === 1 && (
                        <FormPessoas />
                    )}

                    {section === 2 && (
                        <FormEndereco />
                    )}

                    {section === 3 && (
                        <FormTelefones />
                    )}

                    {section === 4 && (
                        <FormEmails />
                    )}

                    <Box className="w-[100%] flex flex-row gap-5 justify-end">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    </Box>
                </Box>
            </Box>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
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