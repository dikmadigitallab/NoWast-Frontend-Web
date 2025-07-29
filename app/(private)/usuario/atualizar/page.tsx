"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText, Modal, CircularProgress, Checkbox, ListItemText } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useGetItems } from "@/app/hooks/items/get";
import { useGetContratos } from "@/app/hooks/contrato/get";
 import { useGetFuncoes } from "@/app/hooks/funcoes/get"; 
import { useGetPosicao } from "@/app/hooks/posicao/get";
import { useGetUsuario } from "@/app/hooks/usuario/get";
import { useGetOneUsuario } from "@/app/hooks/usuario/getOneById";

const userSchema = z.object({
    id: z.number({ required_error: "ID é obrigatório", invalid_type_error: "ID inválido" }),
    userType: z.enum(["DIKMA_ADMINISTRATOR", "CONTRACT_MANAGER", "DIKMA_DIRECTOR", "CLIENT_ADMINISTRATOR", "OPERATIONAL"], { required_error: "Tipo de usuário é obrigatório", invalid_type_error: "Tipo de usuário inválido" }),
    status: z.enum(["ACTIVE", "INACTIVE"], { required_error: "Status é obrigatório", invalid_type_error: "Status inválido", }),
    source: z.string().optional(),
    phone: z.string().min(7, { message: "Telefone inválido" }),
    firstLogin: z.boolean({ required_error: "Indicação de primeiro login é obrigatória" }),
    person: z.object({
        create: z.object({
            name: z.string().min(1, { message: "O nome é obrigatório" }),
            tradeName: z.string().min(1, { message: "Nome Fantasia é obrigatório" }),
            document: z.string().min(11, { message: "Documento deve ter pelo menos 11 caracteres" }),
            briefDescription: z.string().min(1, { message: "Descrição é obrigatória" }),
            birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
            gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Gênero é obrigatório", invalid_type_error: "Gênero inválido" }),
            personType: z.enum(["INDIVIDUAL", "COMPANY"], { required_error: "Tipo de pessoa é obrigatório", invalid_type_error: "Tipo de pessoa inválido" }),
            email: z.string().email({ message: "Email inválido" }),
            phone: z.string().min(7, { message: "Telefone inválido" }),
        }),
    }),
    role: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do papel inválido", required_error: "Selecione um cargo" }).min(1, { message: "Selecione um cargo" }) }) }),
    contract: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do contrato inválido", required_error: "Selecione um contrato" }).min(1, { message: "Selecione um contrato" }) }) }),
    position: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do cargo inválido", required_error: "Selecione uma posição" }).min(1, { message: "Selecione uma posição" }) }) }),
    supervisor: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do supervisor inválido", required_error: "Selecione um supervisor" }).min(1, { message: "Selecione um supervisor" }) }) }),
    manager: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do gerente inválido", required_error: "Selecione um gerente" }).min(1, { message: "Selecione um gerente" }) }) }),
    epiIds: z.array(z.number({ invalid_type_error: "ID de EPI inválido" }), { required_error: "Selecione pelo menos um EPI" }).min(1, { message: "Selecione pelo menos um EPI" }),
    equipmentIds: z.array(z.number({ invalid_type_error: "ID de equipamento inválido" }), { required_error: "Selecione pelo menos um equipamento" }).min(1, { message: "Selecione pelo menos um equipamento" }),
    vehicleIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }), { required_error: "Selecione pelo menos um veículo" }).min(1, { message: "Selecione pelo menos um veículo" }),
    productIds: z.array(z.number({ invalid_type_error: "ID de produto inválido" }), { required_error: "Selecione pelo menos um produto" }).min(1, { message: "Selecione pelo menos um produto" }),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AtualizarPessoa() {

    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: undefined,
            userType: undefined,
            status: "ACTIVE",
            source: "",
            phone: "",
            firstLogin: true,
            person: {
                create: {
                    name: "",
                    tradeName: "",
                    document: "",
                    briefDescription: "",
                    birthDate: "",
                    gender: undefined,
                    personType: undefined,
                    email: "",
                    phone: ""
                }
            },
            role: { connect: { id: undefined } },
            contract: { connect: { id: undefined } },
            position: { connect: { id: undefined } },
            supervisor: { connect: { id: undefined } },
            manager: { connect: { id: undefined } },
            epiIds: [],
            equipmentIds: [],
            vehicleIds: [],
            productIds: []
        },
        mode: "onChange"
    });

    const { users } = useGetUsuario();
    const { data } = useGetOneUsuario();
   const { data: cargos } = useGetFuncoes(); 
    const { data: posicao } = useGetPosicao();
    const { data: epis } = useGetItems('ppe');
    const { data: contrato } = useGetContratos();
    const { data: produtos } = useGetItems('product');
    const { data: equipamentos } = useGetItems('tools');
    const { data: transportes } = useGetItems('transport');

    const router = useRouter();
    const [openDisableModal, setOpenDisableModal] = useState(false);

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/usuario/listagem');
    };

    const onSubmit = (formData: UserFormValues) => {
        console.log(formData)
        // const newData = { ...formData, person: { create: { ...formData.person.create, birthDate: new Date(formData.person.create.birthDate).toISOString() } } };
        // console.log(newData);
        // createPessoa(newData);
    };

    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const mapApiDataToFormValues = (apiData: any): UserFormValues => {
        return {
            id: apiData.id,
            userType: apiData.userType,
            status: apiData.status,
            source: apiData.source || "",
            phone: apiData.person.phones[0]?.phoneNumber || "",
            firstLogin: apiData.firstLogin,
            person: {
                create: {
                    name: apiData.person.name,
                    tradeName: apiData.person.tradeName,
                    document: apiData.person.document,
                    briefDescription: apiData.person.briefDescription,
                    birthDate: formatDateForInput(apiData.person.birthDate),
                    gender: apiData.person.gender,
                    personType: apiData.person.personType,
                    email: apiData.person.emails[0]?.email || "",
                    phone: apiData.person.phones[0]?.phoneNumber || ""
                }
            },
            role: { connect: { id: apiData.role?.id || "" } },
            contract: { connect: { id: apiData.contract?.id } },
            position: { connect: { id: apiData.position?.id } },
            supervisor: { connect: { id: apiData.supervisor?.id } },
            manager: { connect: { id: apiData.manager?.id } },
            epiIds: apiData.epis?.map((epi: any) => epi.id) || [],
            equipmentIds: apiData.equipments?.map((eq: any) => eq.id) || [],
            vehicleIds: apiData.vehicles?.map((v: any) => v.id) || [],
            productIds: apiData.products?.map((p: any) => p.id) || []
        };
    };

    useEffect(() => {
        if (data) {
            const formData = mapApiDataToFormValues(data);
            console.log(data)
            reset(formData);
        }
    }, [data, reset]);


    const renderChips = (
        selected: number[],
        fieldName: string,
        onDelete: (value: number) => void,
        items: { id: number, name: string }[] = []
    ) => {
        const safeItems = Array.isArray(items) ? items : [];

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selected?.map((value) => {
                    const selectedItem = safeItems.find(item => item.id === value);
                    return (
                        <Chip
                            key={value}
                            label={selectedItem ? selectedItem.name : `ID: ${value}`}
                            onDelete={() => onDelete(value)}
                            deleteIcon={<IoMdClose onMouseDown={(event) => event.stopPropagation()} />}
                            sx={{
                                backgroundColor: '#00B288',
                                color: 'white',
                                borderRadius: '4px',
                                '& .MuiChip-deleteIcon': {
                                    color: 'white',
                                },
                            }}
                        />
                    );
                })}
            </Box>
        );
    };


    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Usuários</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>


                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Informações da Pessoa</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome completo"
                                {...field}
                                error={!!errors.person?.create?.name}
                                helperText={errors.person?.create?.name?.message}
                                className="w-full"
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
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.document"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Documento"
                                {...field}
                                error={!!errors.person?.create?.document}
                                helperText={errors.person?.create?.document?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.birthDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Data de Nascimento"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.person?.create?.birthDate}
                                helperText={errors.person?.create?.birthDate?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.gender"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.person?.create?.gender}>
                                <InputLabel>Gênero</InputLabel>
                                <Select
                                    label="Gênero"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>Selecione...</MenuItem>
                                    <MenuItem value="MALE">Masculino</MenuItem>
                                    <MenuItem value="FEMALE">Feminino</MenuItem>
                                    <MenuItem value="OTHER">Outro</MenuItem>
                                </Select>
                                <FormHelperText>{errors.person?.create?.gender?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="person.create.personType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.person?.create?.personType}>
                                <InputLabel>Tipo de Pessoa</InputLabel>
                                <Select
                                    label="Tipo de Pessoa"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>Selecione...</MenuItem>
                                    <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                                    <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
                                </Select>
                                <FormHelperText>{errors.person?.create?.personType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.phone"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Telefone da Pessoa"
                                {...field}
                                error={!!errors.person?.create?.phone}
                                helperText={errors.person?.create?.phone?.message}
                                className="w-full"
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
                            label="Descrição"
                            multiline
                            rows={4}
                            {...field}
                            error={!!errors.person?.create?.briefDescription}
                            helperText={errors.person?.create?.briefDescription?.message}
                            sx={formTheme}
                        />
                    )}
                />

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Informações do Usuário</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Email da Pessoa"
                                type="email"
                                {...field}
                                error={!!errors.person?.create?.email}
                                helperText={errors.person?.create?.email?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="userType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.userType}>
                                <InputLabel>Tipo de Usuário</InputLabel>
                                <Select
                                    label="Tipo de Usuário"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>Selecione...</MenuItem>
                                    <MenuItem value="DIKMA_ADMINISTRATOR">Administrador Dikma</MenuItem>
                                    <MenuItem value="CONTRACT_MANAGER">Gestor de Contrato</MenuItem>
                                    <MenuItem value="DIKMA_DIRECTOR">Diretor Dikma</MenuItem>
                                    <MenuItem value="CLIENT_ADMINISTRATOR">Administrador de Cliente</MenuItem>
                                    <MenuItem value="OPERATIONAL">Operacional</MenuItem>
                                </Select>
                                <FormHelperText>{errors.userType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    {...field}
                                    value={field.value || "ACTIVE"}
                                >
                                    <MenuItem value="ACTIVE">Ativo</MenuItem>
                                    <MenuItem value="INACTIVE">Inativo</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Telefone"
                                {...field}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="firstLogin"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Primeiro Login</InputLabel>
                                <Select
                                    label="Primeiro Login"
                                    {...field}
                                    value={field.value ? "true" : "false"}
                                    onChange={(e) => field.onChange(e.target.value === "true")}
                                >
                                    <MenuItem value="true">Sim</MenuItem>
                                    <MenuItem value="false">Não</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Relação Funcional</h2>
                <Box className="w-[100%] flex flex-row gap-5">

                    <Controller
                        name="role.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.role?.connect?.id}>
                                <InputLabel>Cargo</InputLabel>
                                <Select
                                    label="Cargo"
                                    {...field}
                                    error={!!errors.role?.connect?.id}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                   <MenuItem value="" disabled>Selecione um cargo...</MenuItem>
                                   {cargos?.map((role: any) => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}  
                                </Select>
                                <FormHelperText>{errors.role?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="contract.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.contract?.connect?.id}>
                                <InputLabel>Contrato</InputLabel>
                                <Select
                                    label="Contrato"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um contrato...</MenuItem>
                                    {contrato?.map((contract: any) => (
                                        <MenuItem key={contract.id} value={contract.id}>
                                            {contract.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.contract?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="position.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.position?.connect?.id}>
                                <InputLabel>Posição</InputLabel>
                                <Select
                                    label="Posição"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione uma posição...</MenuItem>
                                    {posicao?.map((position: any) => (
                                        <MenuItem key={position.id} value={position.id}>
                                            {position.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.position?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="supervisor.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.supervisor?.connect?.id}>
                                <InputLabel>Supervisor</InputLabel>
                                <Select
                                    label="Supervisor"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um supervisor...</MenuItem>
                                    {Array.isArray(users) && users.map((pessoa) => (
                                        <MenuItem key={pessoa.id} value={pessoa.id}>
                                            {pessoa.person.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.supervisor?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors?.manager?.connect?.id}>
                                <InputLabel>Gerente</InputLabel>
                                <Select
                                    label="Gerente"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array.isArray(users) && users.map((pessoa) => (
                                        <MenuItem key={pessoa.id} value={pessoa.id}>
                                            {pessoa.person.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors?.manager?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>


                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Vínculo de Itens</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="epiIds"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.epiIds} sx={{ width: '25%' }}>
                                <InputLabel>EPIs</InputLabel>
                                <Select
                                    multiple
                                    label="EPIs"
                                    input={<OutlinedInput label="EPIs" />}
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(Array.isArray(value) ? value : []);
                                    }}
                                    renderValue={(selected) => renderChips(
                                        selected as number[],
                                        'epiIds',
                                        (value) => field.onChange((field.value as number[]).filter((item) => item !== value)),
                                        epis?.data?.items || []
                                    )}
                                >
                                    <MenuItem disabled>Adicione EPIs</MenuItem>
                                    {(epis?.data?.items || []).map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            <Checkbox checked={field.value.includes(item.id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.epiIds && (
                                    <p className="text-red-500 text-xs mt-1">{errors.epiIds.message}</p>
                                )}
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="equipmentIds"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.equipmentIds} sx={{ width: '25%' }}>
                                <InputLabel>Equipamentos</InputLabel>
                                <Select
                                    multiple
                                    label="Equipamentos"
                                    input={<OutlinedInput label="Equipamentos" />}
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(Array.isArray(value) ? value : []);
                                    }}
                                    renderValue={(selected) => renderChips(
                                        selected as number[],
                                        'equipmentIds',
                                        (value) => field.onChange((field.value as number[]).filter((item) => item !== value)),
                                        equipamentos?.data?.items || []
                                    )}
                                >
                                    <MenuItem disabled>Adicione equipamentos</MenuItem>
                                    {(equipamentos?.data?.items || []).map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            <Checkbox checked={field.value.includes(item.id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.equipmentIds && (
                                    <p className="text-red-500 text-xs mt-1">{errors.equipmentIds.message}</p>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="vehicleIds"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.vehicleIds} sx={{ width: '25%' }}>
                                <InputLabel>Veículos</InputLabel>
                                <Select
                                    multiple
                                    label="Veículos"
                                    input={<OutlinedInput label="Veículos" />}
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(Array.isArray(value) ? value : []);
                                    }}
                                    renderValue={(selected) => renderChips(
                                        selected as number[],
                                        'vehicleIds',
                                        (value) => field.onChange((field.value as number[]).filter((item) => item !== value)),
                                        transportes?.data?.items || []
                                    )}
                                >
                                    <MenuItem disabled>Adicione veículos</MenuItem>
                                    {(transportes?.data?.items || []).map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            <Checkbox checked={field.value.includes(item.id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.vehicleIds && (
                                    <p className="text-red-500 text-xs mt-1">{errors.vehicleIds.message}</p>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="productIds"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.productIds} sx={{ width: '25%' }}>
                                <InputLabel>Produtos</InputLabel>
                                <Select
                                    multiple
                                    label="Produtos"
                                    input={<OutlinedInput label="Produtos" />}
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(Array.isArray(value) ? value : []);
                                    }}
                                    renderValue={(selected) => renderChips(
                                        selected as number[],
                                        'productIds',
                                        (value) => field.onChange((field.value as number[]).filter((item) => item !== value)),
                                        produtos?.data?.items || []
                                    )}
                                >
                                    <MenuItem disabled>Adicione produtos</MenuItem>
                                    {(produtos?.data?.items || []).map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            <Checkbox checked={field.value.includes(item.id)} />
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.productIds && (
                                    <p className="text-red-500 text-xs mt-1">{errors.productIds.message}</p>
                                )}
                            </FormControl>
                        )}
                    />

                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                    // disabled={!isValid || loading}
                    >
                        Cadastrar
                        {/* {loading ? <CircularProgress color="inherit" size={24} /> : "Cadastrar"} */}
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