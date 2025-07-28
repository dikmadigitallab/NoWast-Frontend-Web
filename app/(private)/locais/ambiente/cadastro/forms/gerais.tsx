"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreate } from "@/app/hooks/crud/create/useCreate";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useCreateAmbiente } from "@/app/hooks/locais/ambiente/create";

const ambienteSchema = z.object({
    name: z.string().min(1, "Nome do Ambiente é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    areaM2: z.number().min(1, "Área em metros quadrados é obrigatória").nullable(),
    sector: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do Setor é obrigatório").nullable() }) }),
});

type AmbienteFormValues = z.infer<typeof ambienteSchema>;

export default function FormDadosGerais() {
    const router = useRouter();
    const { data: setores } = useGet("sector");
    const { create, loading } = useCreateAmbiente("environment");
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<AmbienteFormValues>({
        resolver: zodResolver(ambienteSchema),
        defaultValues: { name: "", description: "", areaM2: null, sector: { connect: { id: null } } },
        mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/items/ambiente/listagem');

    const onSubmit = (formData: AmbienteFormValues) => {
        create(formData);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Ambientes</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

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
                                label="Área (m²)"
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
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            {/* Modal de cancelamento */}
            <Modal open={openDisableModal} onClose={handleCloseDisableModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
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