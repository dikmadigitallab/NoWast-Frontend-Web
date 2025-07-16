"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdClose } from "react-icons/io";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";

const epiSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nomeEpi: z.string().min(1, "Nome do EPI é obrigatório"),
    localSelect: z.string().min(1, "Local é obrigatório"),
    gestorResponsavel: z.string().min(1, "Gestor responsável é obrigatório"),
    fotoEpi: z.any(),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type EpiFormValues = z.infer<typeof epiSchema>;

export default function CadastroEPI() {
    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<EpiFormValues>({
        resolver: zodResolver(epiSchema),
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

    const router = useRouter();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    // Options for Local Select
    const localOptions = [
        "Almoxarifado",
        "Obra 1 - Centro",
        "Obra 2 - Zona Norte",
        "Oficina",
        "Depósito"
    ];

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/items/transporte/listagem');
    };


    return (
        <StyledMainContainer>
            <Box className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Transporte</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <Box className="w-[100%] flex flex-row gap-2">
                    <Box className="w-[50%] flex flex-row gap-2">
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
                                    className="w-[30%]"
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
                            name="nomeEpi"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Nome do EPI"
                                    {...field}
                                    error={!!errors.nomeEpi}
                                    helperText={errors.nomeEpi?.message}
                                    className="w-[70%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>
                    <FormControl sx={formTheme} className="w-[50%]" error={!!errors.localSelect}>
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
                <Box className="w-[100%] flex flex-row gap-2">
                    <Box className="w-[100%] flex flex-row gap-2">
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
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Controller
                            name="fotoEpi"
                            control={control}
                            render={({ field }) => (
                                <Box className="w-[50%] flex items-center" sx={[formTheme, { border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }]}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                        className="mt-2"
                                        style={{ display: 'none' }}
                                        id="upload-file"
                                    />
                                    <label htmlFor="upload-file" className="w-[100%]">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Box className="ml-2">{field.value?.name || "Selecionar foto do EPI"}</Box>
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
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>Cadastrar</Button>
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
    )
}