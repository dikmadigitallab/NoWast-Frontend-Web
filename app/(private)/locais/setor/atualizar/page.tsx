"use client";

import { z } from "zod";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, Modal, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateSetor } from "@/app/hooks/locais/setor/update";
import { useGetOneSetor } from "@/app/hooks/locais/setor/getOneById";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useDeleteSetor } from "@/app/hooks/locais/setor/delete";

const setorSchema = z.object({
    id: z.number().int().min(1, "ID é obrigatório"),
    name: z.string().min(1, "Nome do Setor é obrigatório"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    building: z.object({
        connect: z.object({
            id: z.number().int().min(1, "ID do edifício é obrigatório"),
            contractId: z.number().int().min(1, "ID do contrato é obrigatório")
        })
    })
});

type SetorFormValues = z.infer<typeof setorSchema>;

export default function EditarSetor() {

    const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<SetorFormValues>({
        resolver: zodResolver(setorSchema),
        defaultValues: {
            name: "",
            radius: 0,
            latitude: "",
            longitude: "",
            description: "",
            building: {
                connect: {
                    id: 0,
                    contractId: 0
                }
            }
        },
        mode: "onChange"
    });

    const router = useRouter();
    const { id } = useGetIDStore()
    const { deleteSetor } = useDeleteSetor();
    const { data: setor, getOneSetor } = useGetOneSetor();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { loading, updateSetor } = useUpdateSetor();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
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

    const onSubmit = async (formData: SetorFormValues) => {
        console.log(formData);
        updateSetor(id as number, formData);
    };


    useEffect(() => {
        if (id) getOneSetor(id);
    }, [id]);

    useEffect(() => {
        if (setor) reset({ ...setor, id: setor.id, building: { connect: { id: 1, contractId: 1 } } });
    }, [setor, reset]);

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Setor</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Prédio"
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
                </Box>
                <Box className="w-[100%] flex flex-row justify-between">
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
                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} disabled={loading} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} disabled={loading} onClick={handleOpenDisableModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Deletar exclusão de Setor</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={() => deleteSetor(id as number)} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

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