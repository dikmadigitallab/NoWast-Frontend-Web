"use client";

import { z } from "zod";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { TextField, MenuItem, InputLabel, Select, FormControl, Box, Button } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useEffect } from "react";

const epiSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    epi: z.string().min(1, "Nome do EPI é obrigatório"),
    local: z.string().min(1, "Local é obrigatório"),
    gestor: z.string().min(1, "Gestor responsável é obrigatório"),
    foto: z.any(),
    descricao: z.string().min(1, "Descrição é obrigatória")
});

type EpiFormValues = z.infer<typeof epiSchema>;

export default function EditModal({ modalEdit, handleChangeModalEdit, edit }: any) {

    const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<EpiFormValues>({
        resolver: zodResolver(epiSchema),
        defaultValues: {
            id: "",
            epi: "",
            local: "",
            gestor: "",
            foto: null,
            descricao: ""
        },
        mode: "onChange"
    });

    const localOptions = [
        "Almoxarifado",
        "Obra 1 - Centro",
        "Obra 2 - Zona Norte",
        "Oficina",
        "Depósito"
    ];

    useEffect(() => {
        if (edit && modalEdit) {
            reset({
                id: edit.id,
                epi: edit.epi,
                local: edit.local,
                gestor: edit.gestor,
                foto: edit.foto,
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
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">EPIs</h1>
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                            <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Edição</h1>
                        </Box>

                        <Box className="w-full flex flex-row justify-between">
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
                                        sx={formTheme}
                                    />
                                )}
                            />
                            <Controller
                                name="epi"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Nome do EPI"
                                        {...field}
                                        error={!!errors.epi}
                                        helperText={errors.epi?.message}
                                        className="w-[68.8%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                            <FormControl sx={formTheme} className="w-[20%]" error={!!errors.local}>
                                <InputLabel>Local</InputLabel>
                                <Controller
                                    name="local"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Local"
                                            {...field}
                                            error={!!errors.local}
                                        >
                                            {localOptions.map((local) => (
                                                <MenuItem key={local} value={local}>
                                                    {local}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.local && (
                                    <p className="text-red-500 text-xs mt-1">{errors.local.message}</p>
                                )}
                            </FormControl>
                        </Box>

                        <Box className="w-full flex flex-row justify-between">
                            <Controller
                                name="gestor"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Gestor Responsável"
                                        {...field}
                                        error={!!errors.gestor}
                                        helperText={errors.gestor?.message}
                                        className="w-[49.8%]"
                                        sx={formTheme}
                                    />
                                )}
                            />

                            <Controller
                                name="foto"
                                control={control}
                                render={({ field }) => (
                                    <Box className="w-[49.8%] flex items-center" sx={[formTheme, { border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }]}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                            className="mt-2"
                                            style={{ display: 'none' }}
                                            id="upload-file"
                                        />
                                        <label htmlFor="upload-file" className="w-full">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Box className="ml-2">{field.value?.name || "Selecionar foto do EPI"}</Box>
                                                {field.value && (
                                                    <Box className="mr-2">
                                                        <IoMdClose
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                field.onChange(null);
                                                            }}
                                                            style={{
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        </label>
                                    </Box>
                                )}
                            />
                        </Box>

                        <Box className="w-full flex flex-row justify-between">
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