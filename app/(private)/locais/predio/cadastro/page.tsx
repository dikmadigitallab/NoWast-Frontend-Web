"use client";

import { z } from "zod";
import { TextField, Box, Button, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreatePredio } from "@/app/hooks/locais/predio/create";
import { useGetContratos } from "@/app/hooks/contrato/get";

const predioSchema = z.object({
    name: z.string().min(1, "Nome do Predio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    contract: z.object({
        connect: z.object({
            id: z.number().int().min(1, "ID do contrato é obrigatório")
        })
    })
});

type PredioFormValues = z.infer<typeof predioSchema>;

export default function CadastroPredio() {

    const { control, handleSubmit, formState: { errors, }, setValue } = useForm<PredioFormValues>({
        resolver: zodResolver(predioSchema),
        defaultValues: { name: "", latitude: "", longitude: "", description: "" },
        mode: "onChange"
    });

    const { createPredio, loading } = useCreatePredio();
    const { data: contratos } = useGetContratos();
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
        createPredio(data);
    };

    const handleCompanyChange = (event: any) => {
        setValue("contract.connect.id", event.target.value, { shouldValidate: true });
    };


    return (
        <StyledMainContainer>

            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédio</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
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
                                className="w-[70%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Box className="w-[30%] flex flex-row justify-between gap-2 ">
                        <Controller
                            name="radius"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    variant="outlined"
                                    label="Raio m²"
                                    type="number"
                                    value={value ?? 0}
                                    onChange={e => onChange(parseInt(e.target.value, 10))}
                                    error={!!errors.radius}
                                    helperText={errors.radius?.message}
                                    className="w-[50%]"
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

                <FormControl fullWidth error={!!errors.contract}>
                    <InputLabel id="contract-label">Empresa</InputLabel>
                    <Controller
                        name="contract.connect.id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                labelId="contract-label"
                                label="Empresa"
                                value={field.value || ""}
                                onChange={handleCompanyChange}
                                error={!!errors.contract}
                            >
                                {contratos?.map((contract: any) => (
                                    <MenuItem key={contract.id} value={contract.id}>
                                        {contract.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.contract && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.contract.connect?.id?.message}
                        </p>
                    )}
                </FormControl>

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
                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar "}</Button>
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