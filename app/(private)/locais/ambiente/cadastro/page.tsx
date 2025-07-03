"use client";

import { StyledMainContainer } from "@/app/styles/container/container";
import { IoIosArrowForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import FormSetor from "./forms/servico";
import { Box, Button } from "@mui/material";
import FormDadosGerais from "./forms/gerais";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";

const ambienteSchema = z.object({
    id: z.string().min(1, "ID do local é obrigatório"),
    nome: z.string().min(1, "O nome é obrigatório"),
    dimenssao: z.string().min(1, "Dimensão é obrigatória"),
    sercico: z.string().min(1, "Descrição é obrigatória"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    servico: z.string().min(1, "Serviço é obrigatória"),
    tipo: z.string().min(1, "Descrição é obrigatória"),
    predio: z.string().min(1, "Descrição é obrigatória"),
    setor: z.string().min(1, "Descrição é obrigatória"),
    checkList: z.array(z.string()).min(1, "Checklist é obrigatório"),
});

type UserFormValues = z.infer<typeof ambienteSchema>;

export default function Locais() {

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<UserFormValues>({
        resolver: zodResolver(ambienteSchema),
        defaultValues: {
            id: "",
            nome: "",
            dimenssao: "",
            sercico: "",
            tipo: "",
            descricao: "",
            servico: "",
            predio: "",
            setor: "",
            checkList: [],
        },
        mode: "onChange"
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
        let sectionItens: string[] = [];
        if (section === 1) {
            sectionItens = [watch("id"), watch("nome"), watch("dimenssao"), watch("predio"), watch("setor"), watch("descricao")];
        }
        else if (section === 2) {
            sectionItens = [watch("servico"), watch("tipo")];
        }
        return sectionItens.every(item => item.trim() !== "");
    }

    return (
        <StyledMainContainer>
            <Box className="w-full flex flex-col gap-5">

                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Ambiente</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-full flex items-center h-[100px]">
                    {[1, 2].map((step) => (
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
                                    {step === 1 ? "Dados Gerais" : "Serviços"}
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
                        <FormSetor control={control} formState={{ errors }} />
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