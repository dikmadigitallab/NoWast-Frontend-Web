"use client";

import { StyledMainContainer } from "@/app/styles/container/container";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import FormDadosGerais from "./forms/gerais";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import FormPessoas from "./forms/pessoas";
import FormItens from "./forms/itens";
import FormCheckList from "./forms/checklist";
import { useRouter } from "next/navigation";
import { useSectionStore } from "@/app/store/renderSection";

const activitySchema = z.object({
    id: z.number().min(1, "ID é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    environmentId: z.number().min(1, "ID do ambiente é obrigatório"),
    dateTime: z.string().min(1, "Data e hora são obrigatórias"),
    recurrenceEnum: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE"]),
    statusEnum: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
    activityTypeEnum: z.enum(["NORMAL", "EXTRA", "URGENT"]),
    supervisorId: z.number().min(1, "ID do supervisor é obrigatório"),
    managerId: z.number().min(1, "ID do gerente é obrigatório"),
    observation: z.string().optional(),
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    approvalDate: z.string().optional(),
    approvalUpdatedByUserId: z.number().optional(),
    justification: z.object({
        reason: z.string().optional(),
        description: z.string().optional(),
        justifiedByUserId: z.number().optional(),
        isInternal: z.boolean().optional(),
        transcription: z.string().optional()
    }).optional()
});

type UserFormValues = z.infer<typeof activitySchema>;

export default function Locais() {

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<z.infer<typeof activitySchema>>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            id: 0,
            description: "",
            environmentId: 0,
            dateTime: "",
            recurrenceEnum: "NONE",
            statusEnum: "OPEN",
            activityTypeEnum: "NORMAL",
            supervisorId: 0,
            managerId: 0,
            observation: "",
            approvalStatus: "PENDING",
            justification: {
                reason: "",
                description: "",
                justifiedByUserId: 0,
                isInternal: false,
                transcription: ""
            }
        },
        mode: "onChange",
    });


    const router = useRouter();
    const { setSection, section } = useSectionStore();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const onSubmit = (data: UserFormValues) => {
        console.log("Form data enviado:", data);
    }

    const handleNext = () => {
        if (section < 2) {
            setSection(section + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    }


    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/atividade/listagem');
    };


    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5">

                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividade</h1>
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
                            ${section === step ? "bg-[#00000003]" : ""}`}>
                            <Box className="h-[100%] items-center flex flex-row gap-5 w-[80%]">
                                <Box
                                    style={{ backgroundColor: step < section ? "#E4F5EE" : step === section ? "#3ABA8A" : "#F6F7F8", color: step === section && step === section ? "#fff" : "" }}
                                    className={`w-[70px] h-full flex justify-center items-center rounded-md text-[#3ABA8A] font-semibold`}>
                                    {step}
                                </Box>
                                <h1
                                    className="text-[#43BC8B] font-semibold">
                                    {step === 1 ? "Dados Gerais" : step === 2 ? "Pessoas" : step === 3 ? "Itens" : "Checklist"}
                                </h1>
                            </Box>
                            <IoIosArrowForward />
                        </Box>
                    ))}
                </Box>

                <Box className="flex flex-col gap-5">
                    {section === 1 && (
                        <FormDadosGerais control={control} formState={{ errors }} />
                    )}

                    {section === 2 && (
                        <FormPessoas control={control} formState={{ errors }} />
                    )}

                    {section === 3 && (
                        <FormItens control={control} formState={{ errors }} />
                    )}

                    {section === 4 && (
                        <FormCheckList control={control} formState={{ errors }} />
                    )}
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