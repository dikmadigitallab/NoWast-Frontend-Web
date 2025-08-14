"use client";

import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress, Snackbar, IconButton, SnackbarCloseReason } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useCreateAmbiente } from "@/app/hooks/ambiente/create";
import { formTheme } from "@/app/styles/formTheme/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { GridCloseIcon } from '@mui/x-data-grid';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from 'react';
import { z } from "zod";

const ambienteSchema = z.object({
    name: z.string().min(1, "Nome do Ambiente é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    areaM2: z.number().min(1, "Área em metros quadrados é obrigatória").nullable(),
    sector: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do Setor é obrigatório").nullable() }) }),
});

type AmbienteFormValues = z.infer<typeof ambienteSchema>;

export default function FormDadosGerais() {

    const router = useRouter();
    const { data: setores } = useGet({ url: "sector" });
    const { create, loading } = useCreateAmbiente("environment");
    const [openCancelModal, setOpenCancelModal] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<AmbienteFormValues>({ resolver: zodResolver(ambienteSchema), defaultValues: { name: "", description: "", areaM2: null, sector: { connect: { id: null } } }, mode: "onChange" });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/locais/ambiente/listagem');

    const onSubmit = (formData: AmbienteFormValues) => create(formData);

    const [open, setOpen] = useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const action = (
        <React.Fragment>
            <Box className="flex items-start p-2">
                <Box className="flex flex-col gap-4 items-start">
                    <Box className="w-[90%] text-[1rem]">Nenhum setor cadastrado! Necessário para cadastro de ambiente.</Box>
                    <Button sx={buttonTheme} href='/locais/setor/cadastro' color="secondary" onClick={handleClose}>
                        Cadastrar Setor
                    </Button>
                </Box>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                    sx={{ mr: 1, border: '2px solid', borderRadius: '50%' }}
                    className="custom-border">
                    <GridCloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </React.Fragment>
    );


    useEffect(() => {
        if (setores?.length <= 0) setOpen(true);
    }, [setores])

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={116000}
                onClose={handleClose}
                action={action}
                ContentProps={{
                    sx: {
                        backgroundColor: '#009d78',
                        color: 'white',
                    }
                }}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">
                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Ambiente"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="sector.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl
                                sx={formTheme}
                                fullWidth
                                error={!!errors.sector?.connect?.id}
                            >
                                <InputLabel id="sector-label">Setor</InputLabel>
                                <Select
                                    labelId="sector-label"
                                    label="Setor"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        Clique e selecione...
                                    </MenuItem>
                                    {setores?.map((setor: any) => (
                                        <MenuItem key={setor.id} value={setor.id}>
                                            {setor.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.sector?.connect?.id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.sector.connect.id.message}
                                    </p>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="areaM2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Dimensão"
                                variant="outlined"
                                type="number"
                                {...field}
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? null : Number(value));
                                }}
                                error={!!errors.areaM2}
                                helperText={errors.areaM2?.message}
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Descrição"
                                variant="outlined"
                                multiline
                                rows={6}
                                {...field}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            {/* Modal de cancelamento */}
            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}