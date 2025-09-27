"use client";

import { TextField, Box, Button, Modal, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton, SnackbarCloseReason, Snackbar, Autocomplete } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as React from 'react';
import { z } from "zod";
import { useCreate } from "@/app/hooks/crud/create/create";
import { ImageUploader } from "@/app/components/imageGet";
import { useDebounce } from "@/app/utils/useDebounce";

const setorSchema = z.object({
    name: z.string().min(1, "Nome do Setor é obrigatório"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do edifício é obrigatório")
});

type SetorFormValues = z.infer<typeof setorSchema>;

export default function CadastroSetor() {

    const { control, handleSubmit, formState: { errors } } = useForm<SetorFormValues>({
        resolver: zodResolver(setorSchema),
        defaultValues: { name: "", radius: 0, latitude: "", longitude: "", description: "", buildingId: 0 },
        mode: "onChange"
    });

    const router = useRouter();
    const [searchQueryPredios, setSearchQueryPredios] = useState('');
    const debouncedSearchQueryPredios = useDebounce(searchQueryPredios, 500);
    const [hasSearched, setHasSearched] = useState(false);
    
    const { data: prediosRaw, loading: loadingPredios } = useGet({ 
        url: "building",
        query: debouncedSearchQueryPredios,
        pageSize: 25,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const predios = prediosRaw ? prediosRaw.filter((predio: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === predio.id)
    ) : [];

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { create, loading } = useCreate("sector", "/locais/setor/listagem");

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

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
        const radius = Number(formData.radius);
        if (isNaN(radius) || radius < 1) return;
        const newObject = { ...formData, image: file, radius };
        create(newObject, true);
    };

    const action = (
        <React.Fragment>
            <Box className="flex items-start p-2">
                <Box className="flex flex-col gap-4 items-start">
                    <Box className="w-[90%] text-[1rem]">Nenhum prédio cadastrado! Necessário para cadastro de setor.</Box>
                    <Button sx={buttonTheme} href='/locais/predio/cadastro' color="secondary" onClick={handleClose}>
                        Cadastrar Prédio
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
        // Marca que a busca foi feita quando o loading termina
        if (!loadingPredios) {
            setHasSearched(true);
        }
    }, [loadingPredios]);

    useEffect(() => {
        // Só mostra o modal se já fez a primeira busca, não está carregando, não há query de busca ativa, e não há prédios
        if (hasSearched && !loadingPredios && debouncedSearchQueryPredios === '' && predios?.length <= 0) {
            setOpen(true);
        }
    }, [hasSearched, predios, loadingPredios, debouncedSearchQueryPredios])

    return (
        <StyledMainContainer>
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
                    <FormControl fullWidth error={!!errors.buildingId}>
                        <Controller
                            name="buildingId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={predios || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={predios?.find((predio: any) => predio.id === field.value) || null}
                                    loading={loadingPredios}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryPredios(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const value = newValue?.id || '';
                                        field.onChange(Number(value));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Prédio"
                                            error={!!errors.buildingId}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingPredios ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum prédio encontrado"
                                    loadingText="Carregando prédios..."
                                />
                            )}
                        />
                        {errors.buildingId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.buildingId.message}
                            </p>
                        )}
                    </FormControl>

                    <ImageUploader
                        label="Selecione uma foto do setor"
                        onChange={(file: any) => setFile(file)}
                    />
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