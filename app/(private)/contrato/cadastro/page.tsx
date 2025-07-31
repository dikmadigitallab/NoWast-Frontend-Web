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
import { useState } from "react";
import { useGetEmpresa } from "@/app/hooks/empresa/get";
import { useCreateContrato } from "@/app/hooks/contrato/create";

const contractSchema = z.object({
    name: z.string().min(1, "Nome do contrato é obrigatório"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    company: z.object({
        connect: z.object({
            id: z.number().min(1, "Selecione uma empresa"),
        }),
    })
    // users: z.array(
    //     z.object({
    //         connect: z.object({
    //             id: z.number().min(1, "Selecione pelo menos um usuário"),
    //         }),
    //     })
    // ).min(1, "Selecione pelo menos um usuário"),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export default function CadastroContrato() {

    const { control, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            name: "",
            startDate: "",
            endDate: "",
            company: { connect: { id: 0 } },
            // users: [],
        },
        mode: "onChange",
    });

    const router = useRouter();
    // const { users: usuarios } = useGetUsers();
    const { data: empresas } = useGetEmpresa("company");
    const { create, loading } = useCreateContrato()
    const [openDisableModal, setOpenDisableModal] = useState(false);

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
        setValue("company.connect.id", event.target.value, { shouldValidate: true });
    };

    // const handleUsersChange = (event: any) => {
    //     const selectedIds = event.target.value;
    //     const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    //     setValue(
    //         "users",
    //         idsArray.map(id => ({ connect: { id } })),
    //         { shouldValidate: true }
    //     );
    // };

    // const selectedUserIds = watch("users")?.map(user => user.connect.id) || [];

    const onSubmit = (data: ContractFormValues) => {
        const startDateFormated = new Date(data.startDate).toISOString();
        const endDateFormated = new Date(data.endDate).toISOString();

        create({
            ...data,
            startDate: startDateFormated,
            endDate: endDateFormated,
        });
    };


    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Contrato</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
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

                    <FormControl fullWidth error={!!errors.company}>
                        <InputLabel id="company-label">Empresa</InputLabel>
                        <Controller
                            name="company.connect.id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    labelId="company-label"
                                    label="Empresa"
                                    value={field.value || ""}
                                    onChange={handleCompanyChange}
                                    error={!!errors.company}
                                >
                                    {empresas?.map((company: any) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.acronym}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.company && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.company.connect?.id?.message}
                            </p>
                        )}
                    </FormControl>

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
                                            {(selected as number[]).map((id) => (
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
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
                            Deseja realmente cancelar esse cadastro? Todos os dados serão perdidos.
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