"use client";

import { z } from "zod";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";

const setorSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome_setor: z.string().min(1, "Nome do Setor é obrigatório"),
    setor: z.string().min(1, "Setor é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type SetorFormValues = z.infer<typeof setorSchema>;

export default function CadastroSetor() {

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<SetorFormValues>({
        resolver: zodResolver(setorSchema),
        defaultValues: {
            id: "",
            nome_setor: "",
            setor: "",
            latitude: "",
            longitude: "",
            descricao: ""
        },
        mode: "onChange"
    });

    const localOptions = [
        "Coqueria",
        "Almoxarifado",
        "Oficina",
        "Depósito"
    ];


    return (
        <StyledMainContainer>
            <Box className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Setor</h1>
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
                        name="nome_setor"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Prédio"
                                {...field}
                                error={!!errors.nome_setor}
                                helperText={errors.nome_setor?.message}
                                className="w-[50%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Box className="w-[30%] flex flex-row justify-between gap-2">
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

                    <Box className="w-[10%] flex flex-row justify-between ">
                        <FormControl sx={formTheme} className="w-[100%]" error={!!errors.setor}>
                            <InputLabel>Local</InputLabel>
                            <Controller
                                name="setor"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Local"
                                        {...field}
                                        error={!!errors.setor}
                                    >
                                        {localOptions.map((local) => (
                                            <MenuItem key={local} value={local}>
                                                {local}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.setor && (
                                <p className="text-red-500 text-xs mt-1">{errors.setor.message}</p>
                            )}
                        </FormControl>
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