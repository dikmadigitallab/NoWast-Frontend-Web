"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetPredio } from "@/app/hooks/locais/predio/get";
import { useCreateItem } from "@/app/hooks/items/create";
import { useGetPessoa } from "@/app/hooks/pessoas/pessoa/get";

const equipamentoSchema = z.object({
    name: z.string().min(1, "Nome do Equipamento é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    responsibleManager: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do gestor é obrigatório") }) }),
});

type EquipamentoFormValues = z.infer<typeof equipamentoSchema>;

export default function CadastroEquipamento() {

    const router = useRouter();
    const { data: pessoas } = useGetPessoa();
    const { predio } = useGetPredio();
    const { createItem } = useCreateItem("tools");
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<EquipamentoFormValues>({
        resolver: zodResolver(equipamentoSchema),
        defaultValues: { name: "", description: "", responsibleManager: { connect: { id: 0 } } },
        mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/items/equipamento/listagem');

    const onSubmit = (formData: any) => {
        createItem(formData);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Equipamentos</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Equipamento"
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
                                    {pessoas?.data.items.map((person: any) => (
                                        <MenuItem key={person.id} value={person.id}>
                                            {person.name}
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
                    <Button variant="outlined" type="submit" sx={buttonTheme}>Cadastrar</Button>
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
