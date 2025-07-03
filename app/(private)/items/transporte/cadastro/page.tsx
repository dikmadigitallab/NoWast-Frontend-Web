"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdClose } from "react-icons/io";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";


const transporteSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nomeEpi: z.string().min(1, "Nome do Transporte é obrigatório"),
    localSelect: z.string().min(1, "Local é obrigatório"),
    gestorResponsavel: z.string().min(1, "Gestor responsável é obrigatório"),
    fotoEpi: z.any(),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type EpiFormValues = z.infer<typeof transporteSchema>;

export default function CadastroTransportes() {
    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<EpiFormValues>({
        resolver: zodResolver(transporteSchema),
        defaultValues: {
            id: "",
            nomeEpi: "",
            localSelect: "",
            gestorResponsavel: "",
            fotoEpi: null,
            descricao: ""
        },
        mode: "onChange"
    });

    // Options for Local Select
    const localOptions = [
        "Almoxarifado",
        "Obra 1 - Centro",
        "Obra 2 - Zona Norte",
        "Oficina",
        "Depósito"
    ];

    return (
        <StyledMainContainer>
            <Box className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Transporte</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-full flex flex-row justify-between">
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
                                        borderRadius: "10px"
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="nomeEpi"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Transporte"
                                {...field}
                                error={!!errors.nomeEpi}
                                helperText={errors.nomeEpi?.message}
                                className="w-[68.8%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <FormControl sx={formTheme} className="w-[20%]" error={!!errors.localSelect}>
                        <InputLabel>Local</InputLabel>
                        <Controller
                            name="localSelect"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Local"
                                    {...field}
                                    error={!!errors.localSelect}
                                >
                                    {localOptions.map((local) => (
                                        <MenuItem key={local} value={local}>
                                            {local}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.localSelect && (
                            <p className="text-red-500 text-xs mt-1">{errors.localSelect.message}</p>
                        )}
                    </FormControl>
                </Box>

                <Box className="w-full flex flex-row justify-between">
                    <Controller
                        name="gestorResponsavel"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Gestor Responsável"
                                {...field}
                                error={!!errors.gestorResponsavel}
                                helperText={errors.gestorResponsavel?.message}
                                className="w-[49.8%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="fotoEpi"
                        control={control}
                        render={({ field }) => (
                            <Box className="w-[49.8%] flex items-center" sx={[formTheme, { border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }]}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                    className="mt-2"
                                    style={{ display: 'none' }}
                                    id="upload-file"
                                />
                                <label htmlFor="upload-file" className="w-full">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Box className="ml-2">{field.value?.name || "Selecionar foto do Transporte"}</Box>
                                        {field.value && (
                                            <Box className="mr-2">
                                                <IoMdClose
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        field.onChange(null);
                                                    }}
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </label>
                            </Box>
                        )}
                    />
                </Box>

                <Box className="w-full flex flex-row justify-between">
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

                <Box className="w-full flex flex-row gap-5 justify-end">
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