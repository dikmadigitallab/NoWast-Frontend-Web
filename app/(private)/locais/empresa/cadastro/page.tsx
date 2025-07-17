"use client";

import { z } from "zod";
import { TextField, Box, Button, Modal, MenuItem, Select, FormControl, InputLabel, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useGetSetorEmpresarial } from "@/app/hooks/setor_empresarial/get";
import { GoTrash } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { useCreateSetorEmpresarial } from "@/app/hooks/setor_empresarial/create";
import { useAuthStore } from "@/app/store/storeApp";
import { useCreateEmpresa } from "@/app/hooks/empresa/create";
import { useDeleteSetorEmpresarial } from "@/app/hooks/setor_empresarial/delete";

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
    const { data, setData } = useGetSetorEmpresarial();
    const [novoSetor, setNovoSetor] = useState<string>("");
    const { createEmpresa } = useCreateEmpresa()
    const { data: setor, createSetorEmpresarial } = useCreateSetorEmpresarial();
    const { deleteSetorEmpresarial } = useDeleteSetorEmpresarial();
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { documento, id, email } = useAuthStore();
    const [setorDeleteId, setSetorDeleteId] = useState<string>("");

    const { control, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = useForm<EmpresaFormValues>({
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

    /**
     * Abre o modal de confirma o para deletar o setor empresarial
     */
    const handleOpenDeleteModal = (id: string) => {
        setSetorDeleteId(id);
        setOpenDeleteModal(true);
    };

    /**
     * Fecha o modal de confirma o para deletar o setor empresarial
     */
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    /**
     * Confirma a dele o do setor empresarial
     */
    const handleDeleteConfirm = () => {
        if (setor && data && typeof setorDeleteId === "number") {
            setData({
                ...data,
                data: {
                    ...data.data,
                    items: data.data.items.filter(item => item.id !== setorDeleteId)
                }
            });
        }
        deleteSetorEmpresarial(setorDeleteId);
    };

    /**
     * Abre o modal de confirma o para desabilitar a empresa
     */
    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    /**
     * Fecha o modal de confirma o para desabilitar a empresa
     */
    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    /**
     * Confirma a desabilita o da empresa e redireciona para a lista de empresas
     */
    const handleDisableConfirm = () => {
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
        if (setor && data) {
            setData({
                ...data, data: {
                    ...data.data,
                    items: [...data.data.items, setor]
                }
            });
        }
    }, [setor]);

    useEffect(() => {
        setValue("person.create.document", documento || "");
        setValue("person.connect.document", documento || "");
        setValue("person.connect.id", id || 0);
        setValue("person.create.email", email || "");
    }, [documento, id]);

    const columns: GridColDef<any>[] = [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 70,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton aria-label="visualizar" size="small" onClick={() => handleOpenDeleteModal(params.row.id)}>
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'selecione',
            headerName: 'Selecione',
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton onClick={() => {
                    setValue("businessSector.connect.id", params.row.id)
                }
                } aria-label="editar" size="small" >
                    <FaCheck color={watch("businessSector.connect.id") === params.row.id ? "#00B288" : "#B9B9C3"} size={20} />
                </IconButton>
            ),
        },
        {
            field: 'id',
            headerName: '#ID',
            width: 120
        },
        {
            field: 'description',
            headerName: 'Descrição',
            width: 320,
        },

    ];

    return (
        <StyledMainContainer>
            <Box className="flex flex-col gap-5">
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
                    <Box className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                        <h2 className="text-[#5E5873] text-[1.2rem] font-normal">Setor de Negócios</h2>
                        <Box className="w-[100%] flex flex-col gap-5">
                            <Box className="flex items-center gap-2">
                                <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                                <span className="text-[#3aba8a] font-bold">Setor empresarial</span>
                                <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                            </Box>
                            <Box className="flex flex-row gap-2 h-[60px]">
                                <TextField
                                    variant="outlined"
                                    label="Criar novo Setor Empresarial"
                                    type="text"
                                    value={novoSetor}
                                    onChange={(e) => setNovoSetor(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder="Digite o nome do setor empresarial"
                                    className="w-[49.8%] mb-5"
                                    sx={formTheme}
                                />
                                <Button sx={[buttonTheme, { height: "90%" }]}
                                    disabled={!novoSetor.trim()}
                                    onClick={() => createSetorEmpresarial(novoSetor)}>
                                    <FiPlus size={25} color="#fff" />
                                </Button>
                            </Box>
                            <DataGrid
                                rows={data?.data?.items ?? []}
                                columns={columns}
                                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5, 10, 25]}
                                disableRowSelectionOnClick
                                hideFooterSelectedRowCount
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'unset',
                                        color: 'unset',
                                    },
                                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                                        backgroundColor: '#FAFAFA',
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            />
                            {errors.businessSector?.connect?.id && (
                                <span className="text-[#d32f2f] text-[0.75rem] ml-[14px] mt-[-12px]">
                                    {errors.businessSector.connect.id.message}
                                </span>
                            )}
                        </Box>
                    </Box>
                    <Box className="w-[100%] flex flex-row gap-5 justify-end">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>
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

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Excluir Setor Empresarial</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir o setor empresarial? está ação é irreversível.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDeleteConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

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