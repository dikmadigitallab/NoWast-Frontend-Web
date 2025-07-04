"use client";

import { z } from "zod";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { TextField, Box, Button } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useEffect } from "react";


const predioSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome: z.string().min(1, "Nome do Predio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type EpiFormValues = z.infer<typeof predioSchema>;


export default function EditModal({ modalEdit, handleChangeModalEdit, edit }: any) {

    const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<EpiFormValues>({
        resolver: zodResolver(predioSchema),
        defaultValues: {
            id: "",
            nome: "",
            latitude: "",
            longitude: "",
            descricao: ""
        },
        mode: "onChange"
    });

    useEffect(() => {
        if (edit && modalEdit) {
            reset({
                id: edit.id,
                nome: edit.nome,
                latitude: edit.latitude,
                longitude: edit.longitude,
                descricao: edit.descricao
            })
        }
    }, [edit])

    return (
        <div>
            <Modal
                open={modalEdit}
                onClose={() => handleChangeModalEdit(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] bg-white rounded-lg p-4 justify-between flex flex-col overflow-y-auto">
                    <Box className="flex flex-col gap-5">
                        <Box className="flex gap-2">
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédio</h1>
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                            <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Edição</h1>
                        </Box>

                        <Box className="w-[100%] flex flex-row justify-between">

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
                                                backgroundColor: "#00000012"
                                            }
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="nome"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Nome do Prédio"
                                        {...field}
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                        className="w-[68.8%]"
                                        sx={formTheme}
                                    />
                                )}
                            />

                            <Box className="w-[20%] flex flex-row justify-between ">
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
                                            className="w-[48%]"
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
                                            className="w-[48%]"
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
                    </Box>

                    <Box className="flex gap-2 self-end">
                        <Button
                            onClick={() => handleChangeModalEdit(null)}
                            variant="outlined"
                            sx={buttonThemeNoBackground}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            sx={[buttonTheme, { alignSelf: "end" }]}
                        >
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}