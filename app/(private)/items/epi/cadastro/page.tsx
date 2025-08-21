"use client";

import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useCreate } from "@/app/hooks/crud/create/create";
import { formTheme } from "@/app/styles/formTheme/theme";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { ImageUploader } from "@/app/components/imageGet";

const epiSchema = z.object({
    name: z.string().min(1, "Nome do EPI é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do predio é obrigatório"),
    responsibleManagerId: z.number().int().min(1, "ID do gestor é obrigatório")
});

type EpiFormValues = z.infer<typeof epiSchema>;

export default function CadastroEPI() {

    const router = useRouter();
    const { data: pessoas } = useGetUsuario({});
    const [file, setFile] = useState<File | null>(null);
    const { data: predios } = useGet({ url: 'building' });
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { create, loading } = useCreate("ppe", "/items/epi/listagem");

    const { control, handleSubmit, formState: { errors } } = useForm<EpiFormValues>({
        resolver: zodResolver(epiSchema),
        defaultValues: { name: "", description: "", buildingId: 0, responsibleManagerId: undefined },
        mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/items/epi/listagem');

    const onSubmit = (formData: any) => {
        const newObject = { ...formData, image: file };
        create(newObject, true);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">EPI</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
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
                                <FormControl
                                    sx={formTheme}
                                    fullWidth
                                    error={!!errors.responsibleManagerId}
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
                                        {pessoas?.map((pessoa: any) => (
                                            <MenuItem key={pessoa.id} value={pessoa.id}>
                                                {pessoa.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.responsibleManagerId && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.responsibleManagerId.message}
                                        </p>
                                    )}
                                </FormControl>
                            )}
                        />
                        <FormControl fullWidth error={!!errors.buildingId}>
                            <InputLabel id="building-label">Prédio</InputLabel>
                            <Controller
                                name="buildingId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="building-label"
                                        label="Prédios"
                                        value={field.value || ""}
                                        error={!!errors.buildingId}
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
                            {errors.buildingId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.buildingId.message}
                                </p>
                            )}
                        </FormControl>
                    </Box>

                    <ImageUploader
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

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            {/* Modal de cancelamento */}
            <Modal open={openDisableModal} onClose={handleCloseDisableModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}
