"use client";

import { z } from "zod";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { TextField, Box, Button, CircularProgress } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useState } from "react";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useRouter } from "next/navigation";
import { useUpdatePredio } from "@/app/hooks/locais/predio/update";


const predioSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome_predio: z.string().min(1, "Nome do Predio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    contract: z.object({
        connect: z.object({
            id: z.number().int().min(1, "ID do contrato é obrigatório")
        })
    })
});

type EpiFormValues = z.infer<typeof predioSchema>;


export default function EditarPredio() {

    const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<EpiFormValues>({
        resolver: zodResolver(predioSchema),
        defaultValues: {
            id: "",
            contract: { connect: { id: 1 } },
            latitude: "",
            longitude: "",
            descricao: ""
        },
        mode: "onChange"
    });

    // useEffect(() => {
    //     if (edit && modalEdit) {
    //         reset({
    //             id: edit.id,
    //             nome: edit.nome,
    //             latitude: edit.latitude,
    //             longitude: edit.longitude,
    //             descricao: edit.descricao
    //         })
    //     }
    // }, [edit])

    const { updatePredio, loading } = useUpdatePredio();
    const router = useRouter();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/predio/listagem');
    };

    const onSubmit = (data: any) => {
        console.log(data)
        // updatePredio(data);
    };


    return (
        <StyledMainContainer>

            <Box className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédio</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">

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
                            name="nome_predio"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Nome do Prédio"
                                    {...field}
                                    error={!!errors.nome_predio}
                                    helperText={errors.nome_predio?.message}
                                    className="w-[70%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Box className="w-[20%] flex flex-row justify-between gap-2 ">
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
                        <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </form>
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

    );
}