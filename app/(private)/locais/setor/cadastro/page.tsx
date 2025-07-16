"use client";

import { z } from "zod";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    const router = useRouter();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/setor/listagem');
    };


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