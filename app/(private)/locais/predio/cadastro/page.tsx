"use client";

import { z } from "zod";
import { TextField, Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";

const predioSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome_predio: z.string().min(1, "Nome do Predio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type PredioFormValues = z.infer<typeof predioSchema>;

export default function CadastroPredio() {

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<PredioFormValues>({
        resolver: zodResolver(predioSchema),
        defaultValues: {
            id: "",
            nome_predio: "",
            latitude: "",
            longitude: "",
            descricao: ""
        },
        mode: "onChange"
    });

    return (
        <StyledMainContainer>
            <Box className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédio</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between gap-2">
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="ID#"
                                {...field}
                                error={!!errors.id}
                                helperText={errors.id?.message}
                                className="w-[10%]"
                                sx={{
                                    ...formTheme,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#00000012",
                                        borderRadius: "5px"
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="nome_predio"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Prédio"
                                {...field}
                                error={!!errors.nome_predio}
                                helperText={errors.nome_predio?.message}
                                className="w-[70%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Box className="w-[20%] flex flex-row justify-between gap-2 ">
                        <Controller
                            name="latitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Latitudeº"
                                    {...field}
                                    error={!!errors.latitude}
                                    helperText={errors.latitude?.message}
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Controller
                            name="longitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Longitudeº"
                                    {...field}
                                    error={!!errors.longitude}
                                    helperText={errors.longitude?.message}
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between">
                    <Controller
                        name="descricao"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Descrição"
                                multiline
                                rows={10}
                                {...field}
                                error={!!errors.descricao}
                                helperText={errors.descricao?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>
                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button
                        variant="outlined"
                        sx={buttonThemeNoBackground}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </Box>
        </StyledMainContainer>
    )
}