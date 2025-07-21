"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground, buttonThemeNoBackgroundError } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetPredio } from "@/app/hooks/locais/predio/get";
import { useGetUsers } from "@/app/hooks/usuarios/get";
import { useGetOneItem } from "@/app/hooks/items/getOneById";
import { useUpdateItem } from "@/app/hooks/items/update";
import { useDeleteItem } from "@/app/hooks/items/delete";

const epiSchema = z.object({
    name: z.string().min(1, "Nome do Transport é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    responsibleManager: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do gestor é obrigatório") }) }),
    buildingId: z.number().int().min(-999999999, "ID do prédio é obrigatório")
});

type TransportFormValues = z.infer<typeof epiSchema>;

export default function EditarTransport() {

    const router = useRouter();
    const { users } = useGetUsers();
    const { predio } = useGetPredio();
    const { data } = useGetOneItem("transport");
    const { updateItem, loading } = useUpdateItem("transport");
    const { deleteItem } = useDeleteItem("transport");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<TransportFormValues>({
        resolver: zodResolver(epiSchema),
        defaultValues: {
            name: "",
            description: "",
            buildingId: 1,
            responsibleManager: {
                connect: {
                    id: 0,
                }
            }
        },
        mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/items/epi/listagem');

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onSubmit = (formData: any) => {
        console.log(formData);
        updateItem(data?.id, formData);
    };

    useEffect(() => {
        if (data) reset({ ...data, responsibleManager: { connect: { id: data?.responsibleManagerId } }, buildingId: 1 });
    }, [data, reset]);

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Transport</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Transport"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="responsibleManager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl
                                sx={formTheme}
                                fullWidth
                                error={!!errors.responsibleManager?.connect?.id}
                            >
                                <InputLabel id="responsible-label">Gestor Responsável</InputLabel>
                                <Select
                                    labelId="responsible-label"
                                    label="Gestor Responsável"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        Clique e selecione...
                                    </MenuItem>
                                    {users?.data.items.map((person: any) => (
                                        <MenuItem key={person.person.id} value={person.person.id}>
                                            {person.person.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.responsibleManager?.connect?.id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.responsibleManager.connect.id.message}
                                    </p>
                                )}
                            </FormControl>
                        )}
                    />



                    <Controller
                        name="buildingId"
                        control={control}
                        render={({ field }) => (
                            <FormControl sx={formTheme} fullWidth error={!!errors.buildingId}>
                                <InputLabel>Local (ID do Prédio)</InputLabel>
                                <Select
                                    label="Local (ID do Prédio)"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        Clique e selecione...
                                    </MenuItem>
                                    {predio?.data.items.map((building: any) => (
                                        <MenuItem key={building.id} value={building.id}>
                                            {building.description}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.buildingId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.buildingId.message}</p>
                                )}
                            </FormControl>
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
                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este transport? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={() => deleteItem()} variant="outlined" sx={buttonThemeNoBackgroundError}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar está ação? Todos os dados serão perdidos.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Desistir</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Comfirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}
