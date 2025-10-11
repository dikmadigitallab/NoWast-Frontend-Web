"use client";

import { StyledMainContainer } from "@/app/styles/container/container";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import FormDadosGerais from "./forms/gerais";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import FormPessoas from "./forms/pessoas";
import FormItens from "./forms/itens";
import FormCheckList from "./forms/checklist";
import { useRouter } from "next/navigation";
import { useSectionStore } from "@/app/store/renderSection";
import { useCreateActivity } from "@/app/hooks/atividade/create";
import { toast } from "react-toastify";

const activitySchema = z.object({
    description: z.string().min(1, "Campo Obrigatório"),
    environmentId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    statusEnum: z.enum(["OPEN", "COMPLETED", "UNDER_REVIEW", "PENDING", "JUSTIFIED", "INTERNAL_JUSTIFICATION"]),
    activityTypeEnum: z.enum(["NORMAL", "URGENT", "RECURRING"]),
    supervisorId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    managerId: z.preprocess((val) => val === "" ? undefined : val, z.number({ required_error: "Campo Obrigatório" }).min(1, "Campo Obrigatório")),
    observation: z.string().optional(),
    hasRecurrence: z.enum(["true", "false"]),
    recurrenceType: z.string().min(0, "Campo Obrigatório").optional(),
    recurrenceFinalDate: z.string().optional(),
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
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

export default function Atividade() {

    const { control, handleSubmit, formState: { errors }, setValue, watch, trigger, clearErrors } =
        useForm<any>({
            resolver: zodResolver(activitySchema),
            defaultValues: {
                description: "",
                environmentId: undefined,
                dateTime: new Date().toISOString(),
                statusEnum: "OPEN",
                approvalStatus: "PENDING",
                activityTypeEnum: "NORMAL",
                supervisorId: undefined,
                recurrenceFinalDate: "",
                managerId: undefined,
                hasRecurrence: "false",
                recurrenceType: "",
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
    const { create, loading } = useCreateActivity();
    const { setSection, section } = useSectionStore();
    const [openCancelModal, setOpenCancelModal] = useState(false);
    
    // Estado para rastrear seções validadas
    const [validatedSections, setValidatedSections] = useState<number[]>([1]); // Seção 1 sempre disponível

    // Função para validar campos obrigatórios de cada seção
    const validateSection = (sectionNumber: number): boolean => {
        switch (sectionNumber) {
            case 1: // Dados Gerais
                const generalFields = [
                    { field: "environmentId", condition: watch("environmentId") === undefined },
                    { field: "hasRecurrence", condition: watch("hasRecurrence") === undefined },
                    { field: "dateTime", condition: watch("dateTime") === "" },
                    { field: "statusEnum", condition: watch("statusEnum") === undefined },
                    { field: "activityTypeEnum", condition: watch("activityTypeEnum") === undefined },
                    { field: "approvalStatus", condition: watch("approvalStatus") === undefined },
                    { field: "description", condition: watch("description") === "" },
                ];

                // Validações condicionais para recorrência
                if (watch("hasRecurrence") === "true") {
                    generalFields.push(
                        { field: "recurrenceType", condition: watch("recurrenceType") === "" },
                        { field: "recurrenceFinalDate", condition: watch("recurrenceFinalDate") === "" }
                    );
                }

                return !generalFields.some(item => item.condition);

            case 2: // Pessoas
                const personnelFields = [
                    { field: "managerId", condition: watch("managerId") === undefined },
                    { field: "supervisorId", condition: watch("supervisorId") === undefined },
                    { field: "usersIds", condition: watch("usersIds").length === 0 }
                ];
                return !personnelFields.some(item => item.condition);

            case 3: // Itens
                // Seção 3 não tem campos obrigatórios, sempre válida
                return true;

            case 4: // Checklist
                const checklistFields = [
                    { field: "serviceItemsIds", condition: watch("serviceItemsIds").length === 0 }
                ];
                return !checklistFields.some(item => item.condition);

            default:
                return false;
        }
    };

    // Função para obter campos obrigatórios faltando
    const getMissingRequiredFields = (sectionNumber: number): string[] => {
        const missingFields: string[] = [];
        
        switch (sectionNumber) {
            case 1: // Dados Gerais
                if (watch("environmentId") === undefined) missingFields.push("Ambiente");
                if (watch("hasRecurrence") === undefined) missingFields.push("Atividade Recorrente");
                if (watch("dateTime") === "") missingFields.push("Data e hora de início");
                if (watch("statusEnum") === undefined) missingFields.push("Status");
                if (watch("activityTypeEnum") === undefined) missingFields.push("Tipo de Atividade");
                if (watch("approvalStatus") === undefined) missingFields.push("Status de aprovação");
                if (watch("description") === "") missingFields.push("Observações");
                
                if (watch("hasRecurrence") === "true") {
                    if (watch("recurrenceType") === "") missingFields.push("Tipo de recorrência");
                    if (watch("recurrenceFinalDate") === "") missingFields.push("Data final da recorrência");
                }
                break;

            case 2: // Pessoas
                if (watch("supervisorId") === undefined) missingFields.push("Encarregado");
                if (watch("managerId") === undefined) missingFields.push("Líder/Gestor");
                if (watch("usersIds").length === 0) missingFields.push("Pessoas (pelo menos uma)");
                break;

            case 3: // Itens
                // Sem campos obrigatórios
                break;

            case 4: // Checklist
                if (watch("serviceItemsIds").length === 0) missingFields.push("Itens de serviço (pelo menos um)");
                break;
        }
        
        return missingFields;
    };

    // Função para navegar entre seções com validação
    const navigateToSection = (targetSection: number) => {
        // Se está tentando ir para uma seção já validada, permite
        if (validatedSections.includes(targetSection)) {
            setSection(targetSection);
            return;
        }

        // Se está tentando ir para a próxima seção sequencial
        if (targetSection === section + 1) {
            if (validateSection(section)) {
                // Marca a seção atual como validada
                if (!validatedSections.includes(section)) {
                    setValidatedSections(prev => [...prev, section]);
                }
                // Marca a próxima seção como disponível
                if (!validatedSections.includes(targetSection)) {
                    setValidatedSections(prev => [...prev, targetSection]);
                }
                setSection(targetSection);
            } else {
                const missingFields = getMissingRequiredFields(section);
                const sectionNames = {
                    1: "Dados Gerais",
                    2: "Pessoas", 
                    3: "Itens",
                    4: "Checklist"
                };
                
                toast.error(`Seção ${sectionNames[section as keyof typeof sectionNames]}: Campos obrigatórios faltando: ${missingFields.join(", ")}`);
                trigger();
            }
        } else {
            toast.error("Você só pode navegar para seções já validadas ou para a próxima seção.");
        }
    };

    const onSubmit = (data: UserFormValues) => {
        const convertToString = (arr?: number[]) => arr && arr.length > 0 ? arr.join(",") : "";

        // Converter datetime-local para ISO compensando o timezone
        // Subtrai 3 horas para que o backend receba a hora correta
        const convertToISO = (dateTimeValue: string): string => {
            if (!dateTimeValue) return "";
            const date = new Date(dateTimeValue);
            // Subtrai 3 horas (10800000 ms)
            const adjustedDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
            return adjustedDate.toISOString();
        };

        const newData = {
            ...data,
            hasRecurrence: data.hasRecurrence === "true" ? true : false,
            dateTime: convertToISO(data.dateTime),
            recurrenceFinalDate: data.recurrenceFinalDate ? convertToISO(data.recurrenceFinalDate) : "",
            usersIds: convertToString(data.usersIds),
            epiIds: convertToString(data.epiIds),
            equipmentIds: convertToString(data.equipmentIds),
            productIds: convertToString(data.productIds),
            vehicleIds: convertToString(data.vehicleIds),
            serviceItemsIds: convertToString(data.serviceItemsIds)
        };

        console.log("📤 DADOS SENDO ENVIADOS (CADASTRO):", {
            original: data.dateTime,
            adjusted: newData.dateTime,
            now: new Date().toISOString()
        });

        create(newData);
    };

    const handleNext = () => {
        if (section < 4) {
            navigateToSection(section + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    }

    const handleCloseCancelModal = () => {
        setOpenCancelModal(false);
    };

    const handleOpenCancelModal = () => {
        setOpenCancelModal(true);
    }

    const handleCancelConfirm = () => {
        setSection(1);
        setValidatedSections([1]); // Reset para apenas a primeira seção
        router.push('/atividade/listagem');
    };

    useEffect(() => {
        if (watch("hasRecurrence") === "false") {
            setValue("recurrenceType", "");
            setValue("recurrenceFinalDate", "");
        }
    }, [watch("hasRecurrence"), setValue]);

    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5 p-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividade</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-[100%] flex items-center h-[100px]">
                    {[1, 2, 3, 4].map((step) => {
                        const isAccessible = validatedSections.includes(step);
                        const isCurrent = section === step;
                        const isCompleted = step < section && validatedSections.includes(step);
                        
                        return (
                            <Box
                                key={step}
                                onClick={() => isAccessible ? navigateToSection(step) : null}
                                className={`
                                w-[25%] h-[100%] flex flex-row items-center justify-between p-5 rounded-md
                                ${isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                                ${isCurrent ? "bg-[#00000003]" : ""}`}>
                                <Box className="h-[100%] items-center flex flex-row gap-5 w-[80%]">
                                    <Box
                                        style={{ 
                                            backgroundColor: isCompleted ? "#E4F5EE" : isCurrent ? "#3ABA8A" : "#F6F7F8", 
                                            color: isCurrent ? "#fff" : "" 
                                        }}
                                        className={`w-[70px] h-full flex justify-center items-center rounded-md text-[#3ABA8A] font-semibold`}>
                                        {step}
                                    </Box>
                                    <h1
                                        className={`font-semibold ${isAccessible ? "text-[#43BC8B]" : "text-[#B9B9C3]"}`}>
                                        {step === 1 ? "Dados Gerais" : step === 2 ? "Pessoas" : step === 3 ? "Itens" : "Checklist"}
                                    </h1>
                                </Box>
                                <IoIosArrowForward />
                            </Box>
                        );
                    })}
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

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" onClick={handleOpenCancelModal} sx={buttonThemeNoBackground}>Cancelar</Button>
                    {
                        section <= 3 ? (
                            <Button variant="outlined" sx={buttonTheme} onClick={handleNext}>Próximo</Button>
                        ) : (
                            <Button onClick={handleSubmit(onSubmit)} variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                        )
                    }
                </Box>
            </Box>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}