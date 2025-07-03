"use client";

import { StyledMainContainer } from "@/app/styles/container/container";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import FormDadosGerais from "./forms/gerais";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import FormPessoas from "./forms/pessoas";
import FormItens from "./forms/itens";
import FormCheckList from "./forms/checklist";

const ambienteSchema = z.object({
    id: z.string().min(1, "ID do local é obrigatório"),
    ambiente: z.string().min(1, "O nome é obrigatório"),
    recorrencia: z.string().min(1, "Dimensão é obrigatória"),
    repete_dia: z.string().min(1, "Descrição é obrigatória"),
    horario: z.string().min(1, "Descrição é obrigatória"),
    predio: z.string().min(1, "Serviço é obrigatória"),
    setor: z.string().min(1, "Descrição é obrigatória"),
    servico: z.string().min(1, "Descrição é obrigatória"),
    tipo: z.string().min(1, "Descrição é obrigatória"),
    observacao: z.string().min(1, "Checklist é obrigatório"),
    encarregado: z.string().min(1, "Encarregado é obrigatória"),
    lider: z.string().min(1, "Responsável é obrigatória"),
    pessoas: z.array(z.string()).min(1, "Pessoas é obrigatória"),
    epis: z.array(z.string()).min(1, "EPI é obrigatório"),
    checklist: z.array(z.string()).min(1, "Checklist é obrigatório"),
});

type UserFormValues = z.infer<typeof ambienteSchema>;

export default function Locais() {

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<z.infer<typeof ambienteSchema>>({
        resolver: zodResolver(ambienteSchema),
        defaultValues: {
            id: "",
            ambiente: "",
            recorrencia: "",
            repete_dia: "",
            horario: "",
            predio: "",
            setor: "",
            servico: "",
            tipo: "",
            observacao: "",
            encarregado: "",
            lider: "",
            pessoas: [],
            epis: [],
            checklist: [],
        },
        mode: "onChange",
    });


    const [section, setSection] = useState(1);

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

    const checkComplete = (section: number) => {
        if (section === 1) {
            const fields = [
                watch("id"),
                watch("ambiente"),
                watch("recorrencia"),
                watch("repete_dia"),
                watch("horario"),
                watch("predio"),
                watch("setor"),
                watch("servico"),
                watch("tipo"),
                watch("observacao"),
            ];
            return fields.every(item => item.trim() !== "");
        } else if (section === 2) {
            const fields = [
                watch("encarregado"),
                watch("lider"),
            ];
            const pessoas = watch("pessoas");
            return fields.every(item => item.trim() !== "") && Array.isArray(pessoas) && pessoas.length > 0;
        } else if (section === 3) {
            const epis = watch("epis");
            return Array.isArray(epis) && epis.length > 0;
        } else if (section === 4) {
            const checklist = watch("checklist");
            return Array.isArray(checklist) && checklist.length > 0;
        }
        return false;
    };

    // console.log(
    //     `ID: ${watch("id")}`,
    //     `Ambiente: ${watch("ambiente")}`,
    //     `Recorrência: ${watch("recorrencia")}`,
    //     `Repete dia: ${watch("repete_dia")}`,
    //     `Horário: ${watch("horario")}`,
    //     `Prédio: ${watch("predio")}`,
    //     `Setor: ${watch("setor")}`,
    //     `Serviço: ${watch("servico")}`,
    //     `Tipo: ${watch("tipo")}`,
    //     `Observação: ${watch("observacao")}`,

    // )

    return (
        <StyledMainContainer>
            <Box className="w-full flex flex-col gap-5">

                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividade</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-full flex items-center h-[100px]">
                    {[1, 2, 3, 4].map((step) => (
                        <Box
                            key={step}
                            onClick={() => setSection(step)}
                            className={`
                            w-[25%] h-[100%] flex flex-row items-center justify-between p-5 rounded-md  cursor-pointer 
                            ${section === step ? "bg-[#00000003]" : ""}`}>
                            <Box className="h-[100%] items-center flex flex-row gap-5 w-[80%]">
                                <Box
                                    style={{ backgroundColor: checkComplete(step) ? "#E4F5EE" : step === section ? "#3ABA8A" : "#F6F7F8", color: step === section && !checkComplete(step) ? "#fff" : "" }}
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

                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

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

                    <Box className="w-full flex flex-row gap-5 justify-end">
                        <Button
                            variant="outlined"
                            sx={buttonThemeNoBackground}
                            onClick={() => setSection(1)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={checkComplete(section) ? false : true}
                            sx={[buttonTheme, { alignSelf: "end" }]}
                            onClick={section !== 4 ? handleNext : undefined}
                        >
                            {section === 4 ? "Enviar" : "Avançar"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </StyledMainContainer>
    );
}