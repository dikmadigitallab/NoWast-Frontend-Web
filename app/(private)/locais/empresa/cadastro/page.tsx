"use client";

import { z } from "zod";
import { TextField, Box, Button, Modal, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/storeApp";
import { useCreateEmpresa } from "@/app/hooks/empresa/create";


const empresaSchema = z.object({
    acronym: z.string().min(1, "Sigla é obrigatória").max(10, "Sigla deve ter no máximo 10 caracteres"),
    description: z.string().min(1, "Descrição é obrigatória"),
    person: z.object({
        create: z.object({
            name: z.string().min(1, "Nome é obrigatório"),
            tradeName: z.string().min(1, "Nome Fantasia é obrigatório"),
            document: z.string().min(11, "Documento deve ter pelo menos 11 caracteres"),
            briefDescription: z.string().min(11, "Breve descrição é obrigatória"),
            birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
            gender: z.enum(["MALE", "FEMALE", "OTHER"]),
            personType: z.enum(["INDIVIDUAL", "LEGAL"]),
            email: z.string().email("Email inválido"),
            phone: z.string().min(10, "Telefone inválido")
        }),
        connect: z
            .object({
                id: z.number().int(),
                document: z.string().min(11)
            })
    }),
    businessSector: z.object({
        connect: z.object({
            id: z.number().int("ID é obrigatório").min(1, "Selecione um setor empresarial")
        })
    })
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

export default function CadastroEmpresa() {

    const router = useRouter();
    const { createEmpresa } = useCreateEmpresa()
    const [openModal, setOpenModal] = useState(false);
    const { documento, id, email } = useAuthStore();

    const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            acronym: "",
            description: "",
            person: {
                create: { name: "", tradeName: "", document: "", briefDescription: "", birthDate: "", gender: "MALE", personType: "LEGAL", email: "", phone: "" },
                connect: {
                    id: undefined,
                    document: ""
                }
            },
            businessSector: {
                connect: {
                    id: undefined
                }
            }
        },
        mode: "onChange"
    });


    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleConfirm = () => {
        router.push('/locais/empresa/listagem');
    };

    const onSubmit = (data: EmpresaFormValues) => {
        trigger();
        const formattedData = {
            ...data,
            person: {
                ...data.person,
                create: {
                    ...data.person.create,
                    birthDate: new Date(data.person.create.birthDate).toISOString()
                }
            }
        };
        createEmpresa(formattedData);
    };


    useEffect(() => {
        setValue("person.create.document", documento || "");
        setValue("person.connect.document", documento || "");
        setValue("person.connect.id", id || 0);
        setValue("person.create.email", email || "");
    }, [documento, id]);

    return (
        <StyledMainContainer>
            <Box className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Empresa</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Box className="w-[100%] flex flex-row justify-between gap-2">
                        <Controller
                            name="acronym"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Sigla"
                                    {...field}
                                    error={!!errors.acronym}
                                    helperText={errors.acronym?.message}
                                    className="w-[15%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Descrição da Empresa"
                                    {...field}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    className="w-[85%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>
                    <Box className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                        <h2 className="text-[#5E5873] text-[1.2rem] font-normal">Informações Pessoais</h2>
                        <Box className="flex flex-row gap-2">
                            <Controller
                                name="person.create.personType"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth sx={{ ...formTheme, width: "20%" }}>
                                        <InputLabel>Tipo de Pessoa</InputLabel>
                                        <Select
                                            label="Tipo de Pessoa"
                                            {...field}
                                            error={!!errors.person?.create?.personType}
                                        >
                                            <MenuItem value="LEGAL">Pessoa Jurídica</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="person.create.name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Nome Completo"
                                        {...field}
                                        error={!!errors.person?.create?.name}
                                        helperText={errors.person?.create?.name?.message}
                                        className="w-[40%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                            <Controller
                                name="person.create.tradeName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Nome Fantasia"
                                        {...field}
                                        error={!!errors.person?.create?.tradeName}
                                        helperText={errors.person?.create?.tradeName?.message}
                                        className="w-[40%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                        </Box>
                        <Box className="flex flex-row gap-2">
                            <Controller
                                name="person.create.document"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <TextField
                                            variant="outlined"
                                            label="CNPJ"
                                            {...field}
                                            error={!!errors.person?.create?.document}
                                            helperText={errors.person?.create?.document?.message}
                                            className="w-[30%]"
                                            sx={formTheme}
                                        />
                                    );
                                }}
                            />
                            <Controller
                                name="person.create.birthDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Data de Nascimento/Constituição"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        {...field}
                                        error={!!errors.person?.create?.birthDate}
                                        helperText={errors.person?.create?.birthDate?.message}
                                        className="w-[20%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                            <Controller
                                name="person.create.gender"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth sx={{ ...formTheme, width: "20%" }}>
                                        <InputLabel>Gênero</InputLabel>
                                        <Select
                                            label="Gênero"
                                            {...field}
                                            error={!!errors.person?.create?.gender}
                                        >
                                            <MenuItem value="MALE">Masculino</MenuItem>
                                            <MenuItem value="FEMALE">Feminino</MenuItem>
                                            <MenuItem value="OTHER">Outro</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Box>
                        <Box className="flex flex-row gap-2">
                            <Controller
                                name="person.create.email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Email"
                                        type="email"
                                        {...field}
                                        error={!!errors.person?.create?.email}
                                        helperText={errors.person?.create?.email?.message}
                                        className="w-[50%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                            <Controller
                                name="person.create.phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Telefone"
                                        {...field}
                                        error={!!errors.person?.create?.phone}
                                        helperText={errors.person?.create?.phone?.message}
                                        className="w-[50%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                        </Box>
                        <Controller
                            name="person.create.briefDescription"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Breve Descrição"
                                    multiline
                                    rows={3}
                                    {...field}
                                    error={!!errors.person?.create?.briefDescription}
                                    helperText={errors.person?.create?.briefDescription?.message}
                                    className="w-[100%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>
                    {/* <Box className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                     
                    </Box> */}

                    <Box className="w-[100%] flex flex-row gap-5 justify-end">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenModal}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}
                        >
                            Cadastrar
                        </Button>
                    </Box>
                </form>
            </Box>


            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

        </StyledMainContainer>
    );
}