"use client";

import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useUpdate } from "@/app/hooks/crud/update/update";
import { formTheme } from "@/app/styles/formTheme/theme";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ImageUploader } from "@/app/components/imageGet";
import { useDebounce } from "@/app/utils/useDebounce";

const epiSchema = z.object({
    name: z.string().min(1, "Nome do EPI é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do predio é obrigatório"),
    responsibleManagerId: z.number().int().min(1, "ID do gestor é obrigatório")
});

type EpiFormValues = z.infer<typeof epiSchema>;

export default function EditarEPI() {

    const router = useRouter();
    const { data } = useGetOneById("ppe");
    const [searchQueryPessoas, setSearchQueryPessoas] = useState('');
    const [searchQueryPredios, setSearchQueryPredios] = useState('');
    const debouncedSearchQueryPessoas = useDebounce(searchQueryPessoas, 500);
    const debouncedSearchQueryPredios = useDebounce(searchQueryPredios, 500);
    
    const { data: pessoasRaw, loading: loadingPessoas } = useGetUsuario({ 
        query: debouncedSearchQueryPessoas,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: prediosRaw, loading: loadingPredios } = useGet({ 
        url: 'building',
        query: debouncedSearchQueryPredios,
        pageSize: 25,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const pessoas = pessoasRaw ? pessoasRaw.filter((pessoa: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === pessoa.id)
    ) : [];
    
    const predios = prediosRaw ? prediosRaw.filter((predio: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === predio.id)
    ) : [];

    const [file, setFile] = useState<File | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const { handleDelete } = useDelete("ppe", "/items/epi/listagem");
    const { update, loading } = useUpdate("ppe", "/items/epi/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<EpiFormValues>({
        resolver: zodResolver(epiSchema),
        defaultValues: { name: "", description: "", buildingId: 0, responsibleManagerId: undefined },
        mode: "onChange"
    });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/items/epi/listagem');

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onSubmit = (formData: any) => {
        const newObject = { ...formData, image: file };
        update(newObject, true);
    };

    useEffect(() => {
        if (data) reset({ ...data, responsibleManagerId: data?.responsibleManager?.id, buildingId: data?.building[0]?.id });

        setImageInfo({
            name: data?.ppeFiles[0]?.file?.fileName,
            type: data?.ppeFiles[0]?.file?.fileType,
            size: data?.ppeFiles[0]?.file?.size,
            previewUrl: data?.ppeFiles[0]?.file?.url,
        });
    }, [data, reset]);

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">EPI</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do EPI"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Box className="flex flex-row gap-2">
                        <Controller
                            name="responsibleManagerId"
                            control={control}
                            render={({ field }) => (
                                <CustomAutocomplete
                                    options={pessoas || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    value={pessoas?.find((pessoa: any) => pessoa.personId === field.value) || null}
                                    loading={loadingPessoas}
                                    onInputChange={(newInputValue) => {
                                        setSearchQueryPessoas(newInputValue);
                                    }}
                                    onChange={(newValue) => {
                                        const value = newValue?.personId || '';
                                        field.onChange(Number(value));
                                    }}
                                    label="Gestor Responsável"
                                    error={!!errors.responsibleManagerId}
                                    helperText={errors.responsibleManagerId?.message}
                                    noOptionsText="Nenhum gestor encontrado"
                                    loadingText="Carregando gestores..."
                                    className="w-full"
                                />
                            )}
                        />
                        <Controller
                            name="buildingId"
                            control={control}
                            render={({ field }) => (
                                <CustomAutocomplete
                                    options={predios || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    value={predios?.find((predio: any) => predio.id === field.value) || null}
                                    loading={loadingPredios}
                                    onInputChange={(newInputValue) => {
                                        setSearchQueryPredios(newInputValue);
                                    }}
                                    onChange={(newValue) => {
                                        const value = newValue?.id || '';
                                        field.onChange(Number(value));
                                    }}
                                    label="Prédio"
                                    error={!!errors.buildingId}
                                    helperText={errors.buildingId?.message}
                                    noOptionsText="Nenhum prédio encontrado"
                                    loadingText="Carregando prédios..."
                                    className="w-full"
                                />
                            )}
                        />
                    </Box>

                    <ImageUploader
                        defaultValue={imageInfo}
                        label="Selecione uma foto do EPI"
                        onChange={(file: any) => setFile(file)}
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
                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" disabled={loading} sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este item? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleDelete} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar está ação? Todos os dados serão perdidos.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Comfirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}
