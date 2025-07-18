"use client";

import { z } from "zod";
import { TextField, MenuItem, Checkbox, ListItemText, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText, Modal, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePessoa } from "@/app/hooks/pessoa/create";

const userSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    tradeName: z.string().min(1, "Nome Fantasia é obrigatório"),
    document: z.string().min(11, "Documento deve ter pelo menos 11 caracteres"),
    briefDescription: z.string().min(1, "Descrição é obrigatório"),
    birthDate: z.string().min(1, "Data de nascimento é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(10, "Telefone inválido"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        required_error: "Gênero é obrigatório",
        invalid_type_error: "Selecione um gênero válido"
    }),
    personType: z.enum(["INDIVIDUAL", "LEGAL"], {
        required_error: "Tipo de pessoa é obrigatório",
        invalid_type_error: "Selecione um tipo válido"
    }),

});

type UserFormValues = z.infer<typeof userSchema>;

export default function CadastroPessoas() {

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            tradeName: "",
            document: "",
            briefDescription: "",
            birthDate: "",
            gender: undefined,
            personType: undefined,
            email: "",
            phone: ""
        },
        mode: "onChange"
    });

    const router = useRouter();
    const { createPessoa, loading } = useCreatePessoa();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/pessoas/listagem');
    };

    const onSubmit = (formData: any) => {
        createPessoa(formData);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoas</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome completo*"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="tradeName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome Fantasia*"
                                {...field}
                                error={!!errors.tradeName}
                                helperText={errors.tradeName?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="document"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Documento*"
                                {...field}
                                error={!!errors.document}
                                helperText={errors.document?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="birthDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Data de Nascimento*"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.birthDate}
                                helperText={errors.birthDate?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.gender}>
                                <InputLabel>Gênero*</InputLabel>
                                <Select
                                    label="Gênero*"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>Selecione...</MenuItem>
                                    <MenuItem value="MALE">Masculino</MenuItem>
                                    <MenuItem value="FEMALE">Feminino</MenuItem>
                                    <MenuItem value="OTHER">Outro</MenuItem>
                                </Select>
                                <FormHelperText>{errors.gender?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="personType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.personType}>
                                <InputLabel>Tipo de Pessoa</InputLabel>
                                <Select
                                    label="Tipo de Pessoa"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>Selecione...</MenuItem>
                                    <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                                    <MenuItem value="LEGAL">Pessoa Jurídica</MenuItem>
                                </Select>
                                <FormHelperText>{errors.personType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Email*"
                                type="email"
                                {...field}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Telefone*"
                                {...field}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Controller
                    name="briefDescription"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição*"
                            multiline
                            rows={4}
                            {...field}
                            error={!!errors.briefDescription}
                            helperText={errors.briefDescription?.message}
                            sx={formTheme}
                        />
                    )}
                />

                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                    >
                        {loading ? <CircularProgress color="inherit" size={24} /> : "Cadastrar"}
                    </Button>
                </Box>
            </form>

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