"use client";

import { TextField, Box, Button, Modal, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton, SnackbarCloseReason, Snackbar } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { IoImagesOutline } from "react-icons/io5";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import * as React from 'react';
import { z } from "zod";
import { useCreate } from "@/app/hooks/crud/create/create";

const setorSchema = z.object({
    name: z.string().min(1, "Nome do Setor é obrigatório"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    building: z.object({
        connect: z.object({
            id: z.number().int().min(1, "ID do edifício é obrigatório").nullable()
        })
    })
});

type SetorFormValues = z.infer<typeof setorSchema>;

export default function CadastroSetor() {

    const { control, handleSubmit, formState: { errors } } = useForm<SetorFormValues>({
        resolver: zodResolver(setorSchema),
        defaultValues: {
            name: "",
            radius: 0,
            latitude: "",
            longitude: "",
            description: "",
            building: {
                connect: {
                    id: null
                }
            }
        },
        mode: "onChange"
    });


    const router = useRouter();
    const { data: predios } = useGet({ url: "building" });
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { create, loading } = useCreate("sector", "/locais/setor/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);
    const [open, setOpen] = useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button sx={{ ...buttonTheme, mr: 1 }} href='/locais/predio/cadastro' color="secondary" size="small" onClick={handleClose}>
                Cadastrar Prédio
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
                <GridCloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/setor/listagem');
    };

    const onSubmit = async (formData: any) => {
        create(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageData = {
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
        };
        setImageInfo(imageData);
    };

    useEffect(() => {
        if (predios?.length <= 0) setOpen(true);
    }, [predios])

    return (
        <StyledMainContainer>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Nenhum prédio cadastrado! Necessário para cadastro de setor."
                action={action}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Setor</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Setor"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
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
                                className="w-[100%]"
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
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="radius"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <TextField
                                type="number"
                                variant="outlined"
                                label="Raio (m²)"
                                {...field}
                                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                                error={!!errors.radius}
                                helperText={errors.radius?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-full flex gap-2">
                    <FormControl fullWidth error={!!errors.building?.connect?.id}>
                        <InputLabel id="building-label">Prédio</InputLabel>
                        <Controller
                            name="building.connect.id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="building-label"
                                    label="Prédios"
                                    value={field.value || ""}
                                    error={!!errors.building?.connect?.id}
                                >
                                    <MenuItem value="" disabled>Selecione um prédio...</MenuItem>
                                    {predios?.map((building: any) => (
                                        <MenuItem key={building.id} value={building.id}>
                                            {building.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.building?.connect?.id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.building?.connect?.id.message}
                            </p>
                        )}
                    </FormControl>
                    <Box className="w-full h-[57px] flex  items-center border border-dashed relative border-[#5e58731f] rounded-lg cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                            onChange={handleFileChange}
                        />
                        {imageInfo ? (
                            <Box className="absolute w-full flex justify-between items-center p-3">
                                <Box className="flex flex-row items-center gap-3">
                                    <img src={imageInfo.previewUrl} alt="Preview" className="w-[30px] h-[30px]" />
                                    <Box className="flex flex-col">
                                        <p className="text-[.8rem] text-[#000000]">Nome: {imageInfo.name}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tipo: {imageInfo.type}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tamanho: {(imageInfo.size / 1024).toFixed(2)} KB</p>
                                    </Box>
                                </Box>
                                <IoMdClose color="#5E5873" onClick={() => setImageInfo(null)} />
                            </Box>
                        )
                            :
                            <Box className="absolute w-full flex justify-center items-center p-3 gap-2 pointer-events-none">
                                <IoImagesOutline color="#5E5873" size={25} />
                                <p className="text-[.8rem] text-[#000000]">Selecione uma foto do EPI</p>
                            </Box>
                        }
                    </Box>
                </Box>

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição"
                            multiline
                            rows={10}
                            {...field}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            className="w-[100%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
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