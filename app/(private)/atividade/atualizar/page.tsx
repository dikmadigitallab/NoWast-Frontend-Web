"use client";

import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useUpdateActivity } from "@/app/hooks/atividade/update";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useSectionStore } from "@/app/store/renderSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoIosArrowForward } from "react-icons/io";
import { Box, Button, Modal } from "@mui/material";
import FormCheckList from "./forms/checklist";
import FormDadosGerais from "./forms/gerais";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormPessoas from "./forms/pessoas";
import FormItens from "./forms/itens";
import { z } from "zod";

const activitySchema = z.object({
    description: z.string().min(1, "Campo Obrigatório"),
    environmentId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    statusEnum: z.enum(["OPEN", "COMPLETED", "UNDER_REVIEW", "PENDING", "JUSTIFIED", "INTERNAL_JUSTIFICATION"]),
    activityTypeEnum: z.enum(["NORMAL", "URGENT", "RECURRING"]),
    supervisorId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    managerId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    observation: z.string().optional(),
    hasRecurrence: z.enum(["true", "false"]),
    recurrenceType: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    recurrenceFinalDate: z.string().min(1, "Campo Obrigatório"),
    dateTime: z.string().min(1, "Campo Obrigatório"),
    approvalDate: z.string().optional(),
    approvalUpdatedByUserId: z.union([z.number(), z.null()]).optional(),
    serviceItemsIds: z.array(z.number().min(1)).min(1, "Pelo menos um item de serviço é obrigatório"),
    usersIds: z.array(z.number().min(1)).min(1, "Pelo menos um usuário é obrigatório"),
    epiIds: z.array(z.number().min(1)).optional(),
    equipmentIds: z.array(z.number().min(1)).optional(),
    productIds: z.array(z.number().min(1)).optional(),
    vehicleIds: z.array(z.number().min(1)).optional(),
});

type UserFormValues = z.infer<typeof activitySchema>;

export default function AtividadeAtualizar() {

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch, trigger, clearErrors } =
        useForm<any>({
            resolver: zodResolver(activitySchema),
            defaultValues: {
                description: "",
                environmentId: undefined,
                dateTime: "",
                recurrenceFinalDate: "",
                statusEnum: "OPEN",
                approvalStatus: "PENDING",
                activityTypeEnum: "NORMAL",
                supervisorId: undefined,
                managerId: undefined,
                hasRecurrence: "false",
                recurrenceType: "DAILY",
                usersIds: [],
                epiIds: [],
                equipmentIds: [],
                productIds: [],
                vehicleIds: []
            },
            mode: "onChange",
            reValidateMode: "onChange",
        });

    const router = useRouter();
    const { update } = useUpdateActivity();
    const { setSection, section } = useSectionStore();
    const { data: atividade } = useGetOneById("activity");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { handleDelete } = useDelete("activity", "/atividade/listagem");

    const onSubmit = (data: UserFormValues) => {
        const convertToString = (arr?: number[]) => arr && arr.length > 0 ? arr.join(",") : "";

        const newData = {
            ...data,
            hasRecurrence: data.hasRecurrence === "true" ? true : false,
            usersIds: convertToString(data.usersIds),
            epiIds: convertToString(data.epiIds),
            equipmentIds: convertToString(data.equipmentIds),
            productIds: convertToString(data.productIds),
            vehicleIds: convertToString(data.vehicleIds),
            serviceItemsIds: convertToString(data.serviceItemsIds)
        };

        update(newData);
    };

    const handleNext = () => {

        const requiredFields = [
            { field: "environmentId", condition: watch("environmentId") === undefined },
            { field: "hasRecurrence", condition: watch("hasRecurrence") === undefined },
            { field: "recurrenceFinalDate", condition: watch("recurrenceFinalDate") === "" },
            { field: "dateTime", condition: watch("dateTime") === "" },
            { field: "statusEnum", condition: watch("statusEnum") === undefined },
            { field: "activityTypeEnum", condition: watch("activityTypeEnum") === undefined },
            { field: "approvalStatus", condition: watch("approvalStatus") === undefined }
        ];

        const personnelFields = [
            { field: "managerId", condition: watch("managerId") === undefined },
            { field: "supervisorId", condition: watch("supervisorId") === undefined },
            { field: "usersIds", condition: watch("usersIds").length === 0 }
        ];

        const hasMissingRequiredField = requiredFields.some(item => item.condition);
        const hasMissingPersonnelField = personnelFields.some(item => item.condition);

        if (hasMissingRequiredField && section === 1) {
            trigger();
            return;
        }

        if (hasMissingPersonnelField && section === 2) {
            trigger();
            return;
        }

        if (section < 4) {
            clearErrors();
            setSection(section + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    }
    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    }

    const handleDisableConfirm = () => {
        router.push('/atividade/listagem');
    };

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    useEffect(() => {
        if (atividade) {
            setValue('description', atividade?.description);
            setValue('environmentId', atividade?.environmentId);
            setValue('statusEnum', atividade?.statusEnum);
            setValue('dateTime', atividade?.dateTime);
            setValue('activityTypeEnum', atividade?.activityTypeEnum);
            setValue('supervisorId', atividade?.supervisorId);
            setValue('managerId', atividade?.managerId);
            setValue('observation', atividade?.observation || '');
            setValue('hasRecurrence', atividade?.recurrenceId ? 'true' : 'false');
            setValue('approvalStatus', atividade?.approvalStatus);
            setValue('approvalDate', atividade?.approvalDate ? atividade?.approvalDate : '');
            setValue('approvalUpdatedByUserId', atividade?.approvalUpdatedByUserId || null);
            setValue('serviceItemsIds', atividade?.checklists?.map((item: any) => item.serviceItemId));
            setValue("users", atividade?.userActivities);
            setValue('usersIds', atividade?.userActivities?.map((user: any) => user.userId));
            setValue('epis', atividade?.ppes);
            setValue('epiIds', atividade?.ppes?.map((ppe: any) => ppe.id));
            setValue('produtos', atividade?.products);
            setValue('productIds', atividade?.products?.map((product: any) => product.id));
            setValue('transportes', atividade?.transports);
            setValue('vehicleIds', atividade?.transports?.map((transport: any) => transport.id));
            setValue('equipamentos', atividade?.tools);
            setValue('equipamentoIds', atividade?.tools?.map((equipment: any) => equipment.id));
            setValue('serviceItems', atividade?.checklists);
            setValue('serviceItemsIds', atividade?.checklists?.map((checklist: any) => checklist.id));
        }
    }, [atividade, reset]);

    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5 p-5 border  border-[#5e58731f] rounded-lg">
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
                    <FormCheckList control={control} formState={{ errors }} setValue={setValue} watch={watch} />
                )}

                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Box className="w-[100%] flex flex-row gap-5 justify-between">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                        <Box className="flex flex-row gap-5" >
                            <Box className="flex flex-row justify-end gap-4">
                                <Button variant="outlined" onClick={handleOpenDisableModal} sx={buttonThemeNoBackground}>Cancelar</Button>
                                {
                                    section <= 3 ? (
                                        <Button variant="outlined" sx={buttonTheme} onClick={handleNext}>Próximo</Button>
                                    ) : (
                                        <Button variant="outlined" sx={buttonTheme} onClick={handleSubmit(onSubmit)}>Enviar</Button>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este item? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleDelete} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}