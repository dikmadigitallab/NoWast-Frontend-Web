"use client";

import { z } from "zod";
import { TextField, Box, Button, Modal, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";

const contractSchema = z.object({
    name: z.string().min(1, "Nome do contrato é obrigatório"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    companyId: z.number().min(1, "Selecione uma empresa"),
    building: z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Nome do edifício é obrigatório"),
        description: z.string().min(1, "Descrição é obrigatória"),
        radius: z.number().min(1, "Raio é obrigatório"),
        latitude: z.string().min(1, "Latitude é obrigatória"),
        longitude: z.string().min(1, "Longitude é obrigatória"),
    }).optional(),
    // users: z.array(
    //     z.object({
    //         connect: z.object({
    //             id: z.number().min(1, "Selecione pelo menos um usuário"),
    //         }),
    //     })).min(1, "Selecione pelo menos um usuário").optional()
});

type ContractFormValues = z.infer<typeof contractSchema>;

export default function EditContrato() {
    const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            name: "",
            startDate: "",
            endDate: "",
            companyId: 0,
            building: undefined,
            // users: [],
        },
        mode: "onChange",
    });

    const router = useRouter();
    // const { users: usuarios } = useGetUsers();
    const { data: empresas } = useGet({ url: "company" });
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { data, loading } = useGetOneById('contract');

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/contrato/listagem');
    };

    const handleCompanyChange = (event: any) => {
        setValue("companyId", event.target.value, { shouldValidate: true });
    };

    const handleUsersChange = (event: any) => {
        console.log(event.target.value);
        // const selectedIds = event.target.value;
        // const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
        // setValue("users", idsArray, { shouldValidate: true });
    };


    // const selectedUserIds = watch("users") || [];

    const onSubmit = (data: ContractFormValues) => {
        console.log(data)
    };

    useEffect(() => {
        if (data) {
            const startDate = data.startDate ? data.startDate.split('T')[0] : '';
            const endDate = data.endDate ? data.endDate.split('T')[0] : '';
            const formData = {
                name: data.name,
                startDate,
                endDate,
                companyId: data.companyId,
                building: data.building || undefined,
                // users: data.users?.map((user: any) => user.id) || [],
            };

            reset(formData);
        }
    }, [data, reset]);

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Contrato</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Edição</h1>
                </Box>

                <Box className="w-[100%] flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Contrato"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Box className="flex gap-5">
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Data de Início"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    {...field}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate?.message}
                                    sx={formTheme}
                                    className="w-full"
                                />
                            )}
                        />

                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Data de Término"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    {...field}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate?.message}
                                    sx={formTheme}
                                    className="w-full"
                                />
                            )}
                        />
                    </Box>

                    <FormControl fullWidth error={!!errors.companyId}>
                        <InputLabel id="company-label">Empresa</InputLabel>
                        <Controller
                            name="companyId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    labelId="company-label"
                                    label="Empresa"
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleCompanyChange(e);
                                    }}
                                    error={!!errors.companyId}
                                >
                                    {empresas?.map((company: any) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.acronym}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.companyId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.companyId.message}
                            </p>
                        )}
                    </FormControl>

                    {watch("building") && (
                        <>
                            <Controller
                                name="building.name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Nome do Edifício"
                                        {...field}
                                        error={!!errors.building?.name}
                                        helperText={errors.building?.name?.message}
                                        sx={formTheme}
                                    />
                                )}
                            />

                            <Controller
                                name="building.description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Descrição do Edifício"
                                        {...field}
                                        error={!!errors.building?.description}
                                        helperText={errors.building?.description?.message}
                                        sx={formTheme}
                                    />
                                )}
                            />

                            <Box className="flex gap-5">
                                <Controller
                                    name="building.radius"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            label="Raio (metros)"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!errors.building?.radius}
                                            helperText={errors.building?.radius?.message}
                                            sx={formTheme}
                                            className="w-full"
                                        />
                                    )}
                                />

                                <Controller
                                    name="building.latitude"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            label="Latitude"
                                            {...field}
                                            error={!!errors.building?.latitude}
                                            helperText={errors.building?.latitude?.message}
                                            sx={formTheme}
                                            className="w-full"
                                        />
                                    )}
                                />

                                <Controller
                                    name="building.longitude"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            label="Longitude"
                                            {...field}
                                            error={!!errors.building?.longitude}
                                            helperText={errors.building?.longitude?.message}
                                            sx={formTheme}
                                            className="w-full"
                                        />
                                    )}
                                />
                            </Box>
                        </>
                    )}

                    {/* <FormControl fullWidth error={!!errors.users}>
                        <InputLabel id="users-label">Pessoa</InputLabel>
                        <Controller
                            name="users"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    labelId="users-label"
                                    label="Pessoa"
                                    multiple
                                    value={selectedUserIds}
                                    onChange={handleUsersChange}
                                    renderValue={(selected) => (
                                        <div className="flex flex-wrap gap-1">
                                            {(selected as any[]).map((id) => (
                                                <span key={id} className="bg-gray-100 px-2 py-1 rounded">
                                                    {usuarios?.data?.items.find((user: any) => user.id === id)?.person.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {usuarios?.data?.items.map((user: any) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.person.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.users && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.users.message}
                            </p>
                        )}
                    </FormControl> */}
                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Atualizar"}
                    </Button>
                </Box>
            </form>

            <Modal
                open={openDisableModal}
                onClose={handleCloseDisableModal}
                aria-labelledby="disable-confirmation-modal"
                aria-describedby="disable-confirmation-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">
                            Deseja realmente cancelar a edição? Todas as alterações serão perdidas.
                        </p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>
                                Voltar
                            </Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>
                                Confirmar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}