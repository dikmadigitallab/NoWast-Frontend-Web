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
import FormJustificativa from "./forms/justificativa";

const activitySchema = z.object({
    id: z.number().min(1, "ID é obrigatório").nullable().optional(),
    description: z.string(),
    environmentId: z.number().min(1, "ID do ambiente é obrigatório").nullable().optional(),
    dateTime: z.string(),
    recurrenceEnum: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE"]).optional(),
    statusEnum: z.enum(["OPEN", "COMPLETED", "UNDER_REVIEW", "PENDING", "JUSTIFIED", "INTERNAL_JUSTIFICATION", ""]).optional(),
    activityTypeEnum: z.enum(["NORMAL", "URGENT", "RECURRING", ""]),
    supervisorId: z.number().min(1, "ID do supervisor é obrigatório").nullable().optional(),
    managerId: z.number().min(1, "ID do gerente é obrigatório").nullable().optional(),
    observation: z.string().optional(),
    hasRecurrence: z.enum(["true", "false", ""]).optional(),
    recurrenceType: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE", ""]),
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    approvalDate: z.string().optional(),
    approvalUpdatedByUserId: z.number().nullable().optional(),
    justification: z.object({
        reason: z.string().optional(),
        description: z.string().optional(),
        justifiedByUserId: z.number().nullable().optional(),
        isInternal: z.boolean().optional(),
        transcription: z.string().optional()
    }).optional(),
    usersIds: z.array(z.number()).min(1, "Pelo menos um usuário é obrigatório"),
    epiIds: z.array(z.number()).min(1, "Pelo menos um EPI é obrigatório"),
    equipmentIds: z.array(z.number()).min(1, "Pelo menos um equipamento é obrigatório"),
    productIds: z.array(z.number()).min(1, "Pelo menos um produto é obrigatório"),
    vehicleIds: z.array(z.number()).min(1, "Pelo menos um transporte é obrigatório"),
});



type UserFormValues = z.infer<typeof activitySchema>;

export default function Locais() {

    const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<UserFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            id: null,
            description: "",
            environmentId: null,
            dateTime: "",
            recurrenceEnum: undefined,
            statusEnum: "",
            activityTypeEnum: "",
            supervisorId: null,
            managerId: null,
            observation: "",
            hasRecurrence: "",
            recurrenceType: "",
            approvalStatus: undefined,
            approvalDate: "",
            approvalUpdatedByUserId: null,
            justification: {
                reason: "",
                description: "",
                justifiedByUserId: null,
                isInternal: false,
                transcription: "Transcrição do áudio explicativo"
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
            <Box className="w-[100%] flex flex-col gap-5 p-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividade</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-[100%] flex items-center h-[100px]">
                    {[1, 2, 3, 4, 5].map((step) => (
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
                                    {step === 1 ? "Dados Gerais" : step === 2 ? "Pessoas" : step === 3 ? "Itens" : step === 4 ? "Justificativa" : "CheckList"}
                                </h1>
                            </Box>
                            <IoIosArrowForward />
                        </Box>
                    ))}
                </Box>

                {section === 1 && (
                    <FormDadosGerais control={control} formState={{ errors }} watch={watch} />
                )}
                {section === 2 && (
                    <FormPessoas control={control} formState={{ errors }} setValue={setValue} watch={watch} />
                )}
                {section === 3 && (
                    <FormItens control={control} formState={{ errors }} setValue={setValue} watch={watch} />
                )}
                {section === 4 && (
                    <FormJustificativa control={control} formState={{ errors }} />
                )}
                {section === 5 && (
                    <FormCheckList control={control} formState={{ errors }} />
                )}

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                    <Button variant="outlined" type="submit" sx={[buttonTheme]}>Avançar</Button>
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