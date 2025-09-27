"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText, Modal, CircularProgress, Checkbox, ListItemText, InputAdornment, Autocomplete } from "@mui/material";
import { set, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useAuthStore } from "@/app/store/storeApp";
import { useCreateUser } from "@/app/hooks/usuarios/create";
import { ImageUploader } from "@/app/components/imageGet";
import { useDebounce } from "@/app/utils/useDebounce";

const userSchema = z.object({
    userType: z.enum(["DIKMA_ADMINISTRATOR", "CONTRACT_MANAGER", "DIKMA_DIRECTOR", "CLIENT_ADMINISTRATOR", "OPERATIONAL"], { required_error: "Tipo de usuário é obrigatório", invalid_type_error: "Tipo de usuário inválido" }).nullable(),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 8 caracteres" }),
    status: z.enum(["ACTIVE", "INACTIVE"], { required_error: "Status é obrigatório", invalid_type_error: "Status inválido", }),
    source: z.string().optional(),
    firstLogin: z.boolean({ required_error: "Indicação de primeiro login é obrigatória" }),
    startDate: z.string({ message: "Data de admissão é obrigatória" }).optional(),
    endDate: z.string({ message: "Data de demissão é obrigatória" }).optional(),
    person: z.object({
        create: z.object({
            name: z.string().min(1, { message: "O nome é obrigatório" }),
            tradeName: z.string({ message: "Nome Fantasia é obrigatório" }).optional(),
            document: z.string().min(11, { message: "Documento deve ter 11 (CPF) ou 14 (CNPJ) números", }),
            briefDescription: z.string().min(1, { message: "Descrição é obrigatória" }),
            birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
            gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Gênero é obrigatório", invalid_type_error: "Gênero inválido" }),
            personType: z.enum(["INDIVIDUAL", "COMPANY"], { required_error: "Tipo de pessoa é obrigatório", invalid_type_error: "Tipo de pessoa inválido" }),
            email: z.string().email({ message: "Email inválido" }),
            phone: z.string().min(7, { message: "Telefone inválido" }),
            address: z.object({
                address: z.string().min(1, { message: "Endereço é obrigatório" }),
                number: z.string().min(1, { message: "Número é obrigatório" }),
                complement: z.string(),
                district: z.string().min(1, { message: "Bairro é obrigatório" }),
                city: z.string().min(1, { message: "Cidade é obrigatória" }),
                state: z.string().min(1, { message: "Estado é obrigatório" }),
                postalCode: z.string().min(1, { message: "CEP é obrigatório" }),
                addressType: z.enum(["HOME", "WORK", "OTHER"], { required_error: "Tipo de endereço é obrigatório", invalid_type_error: "Tipo de endereço inválido" }),
                stateAbbreviation: z.string(),
                country: z.string(),
                isDefault: z.boolean({ required_error: "Indicação de endereço padrão é obrigatória" }).optional(),
                isOptIn: z.boolean({ required_error: "Indicação de endereço opt-in é obrigatória" }).optional(),
                latitude: z.string(),
                longitude: z.string()
            }),
        }),
    }),
    contract: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do contrato inválido", required_error: "Selecione um contrato" }).min(1, { message: "Selecione um contrato" }).optional() }).optional() }).optional(),
    position: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do cargo inválido", required_error: "Selecione uma posição" }).min(1, { message: "Selecione uma posição" }).optional() }).optional() }).optional(),
    supervisor: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do supervisor inválido", required_error: "Selecione um supervisor" }).min(1, { message: "Selecione um supervisor" }).optional() }).optional() }).optional(),
    manager: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do gerente inválido", required_error: "Selecione um gerente" }).min(1, { message: "Selecione um gerente" }).optional() }).optional() }).optional(),
    epiIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    equipmentIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    vehicleIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    productIds: z.array(z.number({ invalid_type_error: "ID de produto inválido" }).optional())
});

type UserFormValues = z.infer<typeof userSchema>;

export default function CadastroPessoa() {

    const { userInfo } = useAuthStore();

    const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userType: null,
            password: "",
            source: "Dikma",
            firstLogin: true,
            status: "ACTIVE",
            startDate: new Date().toISOString().split('T')[0],
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
                    phone: "",
                    address: {
                        address: "",
                        number: "",
                        complement: "",
                        district: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        addressType: "HOME",
                        stateAbbreviation: "",
                        country: "",
                        isDefault: true,
                        isOptIn: true,
                        latitude: "",
                        longitude: ""
                    },
                },
            },
            contract: { connect: { id: Number(userInfo?.contractId) } },
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

    // Estados para busca com debounce
    const [searchQueryCargos, setSearchQueryCargos] = useState('');
    const [searchQuerySupervisor, setSearchQuerySupervisor] = useState('');
    const [searchQueryManager, setSearchQueryManager] = useState('');
    const [searchQueryEpis, setSearchQueryEpis] = useState('');
    const [searchQueryEquipamentos, setSearchQueryEquipamentos] = useState('');
    const [searchQueryVeiculos, setSearchQueryVeiculos] = useState('');
    const [searchQueryProdutos, setSearchQueryProdutos] = useState('');
    
    const debouncedSearchQueryCargos = useDebounce(searchQueryCargos, 500);
    const debouncedSearchQuerySupervisor = useDebounce(searchQuerySupervisor, 500);
    const debouncedSearchQueryManager = useDebounce(searchQueryManager, 500);
    const debouncedSearchQueryEpis = useDebounce(searchQueryEpis, 500);
    const debouncedSearchQueryEquipamentos = useDebounce(searchQueryEquipamentos, 500);
    const debouncedSearchQueryVeiculos = useDebounce(searchQueryVeiculos, 500);
    const debouncedSearchQueryProdutos = useDebounce(searchQueryProdutos, 500);

    const { users: usersRaw, loading: loadingUsers } = useGetUsuario({
        query: debouncedSearchQuerySupervisor || debouncedSearchQueryManager,
        pageSize: 25,
        pageNumber: 1
    });
    
    // Remove duplicatas baseadas no ID
    const users = usersRaw ? usersRaw.filter((user: any, index: number, self: any[]) => 
        index === self.findIndex((u: any) => u.id === user.id)
    ) : [];
    
    const { data: episRaw, loading: loadingEpis } = useGet({ 
        url: 'ppe',
        query: debouncedSearchQueryEpis,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: cargosRaw, loading: loadingCargos } = useGet({ 
        url: 'position',
        query: debouncedSearchQueryCargos,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: produtosRaw, loading: loadingProdutos } = useGet({ 
        url: 'product',
        query: debouncedSearchQueryProdutos,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: equipamentosRaw, loading: loadingEquipamentos } = useGet({ 
        url: 'tools',
        query: debouncedSearchQueryEquipamentos,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: transportesRaw, loading: loadingVeiculos } = useGet({ 
        url: 'transport',
        query: debouncedSearchQueryVeiculos,
        pageSize: 25,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const epis = episRaw ? episRaw.filter((epi: any, index: number, self: any[]) => 
        index === self.findIndex((e: any) => e.id === epi.id)
    ) : [];
    
    const cargos = cargosRaw ? cargosRaw.filter((cargo: any, index: number, self: any[]) => 
        index === self.findIndex((c: any) => c.id === cargo.id)
    ) : [];
    
    const produtos = produtosRaw ? produtosRaw.filter((produto: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === produto.id)
    ) : [];
    
    const equipamentos = equipamentosRaw ? equipamentosRaw.filter((equipamento: any, index: number, self: any[]) => 
        index === self.findIndex((e: any) => e.id === equipamento.id)
    ) : [];
    
    const transportes = transportesRaw ? transportesRaw.filter((transporte: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === transporte.id)
    ) : [];

    const [file, setFile] = useState<File | null>(null);
    const [cepLoading, setCepLoading] = useState(false);
    const { create, loading } = useCreateUser("users", "/usuario/listagem");

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
        const newData = {
            ...formData,
            email: formData.person.create.email?.toLowerCase(),
            source: "Dikma",
            phone: formData.person.create.phone?.replace(/[.\-]/g, ''),
            person: {
                create: {
                    ...formData.person.create,
                    ...formData.person.create, document: formData.person.create.document?.replace(/[.\-]/g, ''),
                    birthDate: new Date(formData.person.create.birthDate).toISOString()
                }
            }
        };
        create(newData, file);
    };

    const formatCpfOrCnpj = (value: string) => {
        const type = watch('person.create.personType');
        const digits = value.replace(/\D/g, '');

        if (type === 'INDIVIDUAL') {
            return digits
                .replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})\.(\d{3})(\d{1,2}).*/, '.$1.$2-$3');
        } else {
            return digits
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})\.(\d{3})(\d)/, '.$1/$2-$3')
                .replace(/(\d{4})(\d{2}).*/, '$1-$2');
        }
    };

    const getCepAddress = async (cep: string) => {
        setCepLoading(true);
        if (cep.length < 9) return;

        try {
            const cleanedCep = cep.replace(/\D/g, '');
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
            const viaCepData = await viaCepResponse.json();

            if (viaCepData.erro) return;

            const fullAddress = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade}-${viaCepData.uf}, Brasil`;

            const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=br`);
            const geocodeData = await geocodeResponse.json();

            let latitude = '';
            let longitude = '';

            if (geocodeData.length > 0) {
                latitude = geocodeData[0].lat;
                longitude = geocodeData[0].lon;
            }

            const address = {
                addressType: watch()?.person.create.address.addressType,
                isDefault: true,
                isOptIn: true,
                address: viaCepData.logradouro,
                number: watch()?.person.create.address.number,
                complement: viaCepData.complemento || '',
                district: viaCepData.bairro,
                city: viaCepData.localidade,
                state: viaCepData.uf,
                postalCode: viaCepData.cep.replace(/\D/g, ''),
                stateAbbreviation: viaCepData.uf,
                country: "Brasil",
                latitude: latitude,
                longitude: longitude
            };

            setValue('person.create.address', address as any);
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            trigger('person.create.address.postalCode');
            trigger('person.create.address.state');
            trigger('person.create.address.city');
            trigger('person.create.address.district');
            trigger('person.create.address.address');
            setCepLoading(false);
        }
    }

    const renderChips = (selected: number[], fieldName: string, onDelete: (value: number) => void, items: { id: number, name: string }[] = []) => {
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
                                fontSize: '.7rem',
                                '& .MuiChip-deleteIcon': {
                                    color: 'white',
                                    fontSize: '.8rem',
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
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoa</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Informações Pessoais</h2>
                <Box className="w-[100%] flex flex-row gap-5">

                    <ImageUploader
                        label="Selecione uma foto de perfil"
                        onChange={(file: any) => setFile(file)}
                    />

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
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.personType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.person?.create?.personType}>
                                <InputLabel sx={formTheme}>Tipo de Pessoa</InputLabel>
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
                    <Controller
                        disabled={!watch('person.create.personType')}
                        name="person.create.document"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label={watch('person.create.personType') === "INDIVIDUAL" ? "CPF" : "CNPJ"}
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatCpfOrCnpj(e.target.value);
                                    field.onChange(formatted);
                                }}
                                value={field.value}
                                error={!!errors.person?.create?.document}
                                helperText={errors.person?.create?.document?.message}
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
                                <InputLabel sx={formTheme}>Gênero</InputLabel>
                                <Select label="Gênero" {...field} value={field.value || ""}>
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
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Senha"
                                type="password"
                                {...field}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel sx={formTheme}>Status</InputLabel>
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
                    <Controller
                        name="firstLogin"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel sx={formTheme}>Primeiro Login</InputLabel>
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

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Endereço</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.address.postalCode"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="CEP"
                                {...field}
                                error={!!errors.person?.create?.address?.postalCode}
                                helperText={errors.person?.create?.address?.postalCode?.message}
                                className="w-full"
                                sx={formTheme}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    const formatted = value.replace(/^(\d{5})(\d)/, '$1-$2');
                                    if (formatted.length === 9) {
                                        getCepAddress(formatted);
                                    }
                                    field.onChange(formatted);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {cepLoading && <CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.address.address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Endereço"
                                {...field}
                                disabled={cepLoading}
                                error={!!errors.person?.create?.address?.address}
                                helperText={errors.person?.create?.address?.address?.message}
                                className="w-full"
                                sx={formTheme}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {cepLoading && <CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.address.number"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Número"
                                {...field}
                                error={!!errors.person?.create?.address?.number}
                                helperText={errors.person?.create?.address?.number?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.address.complement"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Complemento"
                                {...field}
                                error={!!errors.person?.create?.address?.complement}
                                helperText={errors.person?.create?.address?.complement?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.address.district"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Bairro"
                                {...field}
                                disabled={cepLoading}
                                error={!!errors.person?.create?.address?.district}
                                helperText={errors.person?.create?.address?.district?.message}
                                className="w-full"
                                sx={formTheme}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {cepLoading && <CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.address.addressType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.person?.create?.address?.addressType}>
                                <InputLabel sx={formTheme}>Tipo de Endereço</InputLabel>
                                <Select
                                    label="Tipo de Endereço"
                                    {...field}
                                    value={field.value || "HOME"}
                                >
                                    <MenuItem value="HOME">Residencial</MenuItem>
                                    <MenuItem value="WORK">Comercial</MenuItem>
                                    <MenuItem value="OTHER">Outro</MenuItem>
                                </Select>
                                <FormHelperText>{errors.person?.create?.address?.addressType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />

                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="person.create.address.city"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Cidade"
                                {...field}
                                disabled={cepLoading}
                                error={!!errors.person?.create?.address?.city}
                                helperText={errors.person?.create?.address?.city?.message}
                                className="w-full"
                                sx={formTheme}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {cepLoading && <CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="person.create.address.state"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Estado"
                                {...field}
                                disabled={cepLoading}
                                error={!!errors.person?.create?.address?.state}
                                helperText={errors.person?.create?.address?.state?.message}
                                className="w-full"
                                sx={formTheme}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {cepLoading && <CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Relacionamentos</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="position.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.position?.connect?.id} sx={formTheme}>
                                <Autocomplete
                                    options={cargos || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={cargos?.find((cargo: any) => cargo.id === field.value) || null}
                                    loading={loadingCargos}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryCargos(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const value = newValue?.id || '';
                                        field.onChange(Number(value));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cargo"
                                            error={!!errors.position?.connect?.id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingCargos ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum cargo encontrado"
                                    loadingText="Carregando cargos..."
                                />
                                <FormHelperText>{errors.position?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="userType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.userType} sx={formTheme}>
                                <InputLabel sx={formTheme}>Tipo de Usuário</InputLabel>
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
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="supervisor.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.supervisor?.connect?.id} sx={formTheme}>
                                <Autocomplete
                                    options={users || []}
                                    getOptionLabel={(option: any) => option.person?.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={users?.find((user: any) => user.id === field.value) || null}
                                    loading={loadingUsers}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQuerySupervisor(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const value = newValue?.id || '';
                                        field.onChange(Number(value));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Supervisor"
                                            error={!!errors.supervisor?.connect?.id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.person?.name}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum supervisor encontrado"
                                    loadingText="Carregando supervisores..."
                                />
                                <FormHelperText>{errors.supervisor?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors?.manager?.connect?.id} sx={formTheme}>
                                <Autocomplete
                                    options={users || []}
                                    getOptionLabel={(option: any) => option.person?.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={users?.find((user: any) => user.id === field.value) || null}
                                    loading={loadingUsers}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryManager(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const value = newValue?.id || '';
                                        field.onChange(Number(value));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Gerente"
                                            error={!!errors?.manager?.connect?.id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.person?.name}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum gerente encontrado"
                                    loadingText="Carregando gerentes..."
                                />
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
                            <FormControl fullWidth error={!!errors.epiIds} sx={{ width: '25%', ...formTheme }}>
                                <Autocomplete
                                    multiple
                                    options={epis || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={epis?.filter((epi: any) => field.value?.includes(epi.id)) || []}
                                    loading={loadingEpis}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryEpis(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((epi: any) => epi.id);
                                        field.onChange(selectedIds);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="EPIs"
                                            error={!!errors.epiIds}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingEpis ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    key={option.id}
                                                    label={option.name}
                                                    size="small"
                                                    onDelete={() => {
                                                        const newValue = value.filter((_, i) => i !== index);
                                                        const selectedIds = newValue.map((epi: any) => epi.id);
                                                        field.onChange(selectedIds);
                                                    }}
                                                    deleteIcon={<IoMdClose onMouseDown={(event: any) => event.stopPropagation()} />}
                                                    sx={{
                                                        backgroundColor: '#00B288',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '.7rem',
                                                        '& .MuiChip-deleteIcon': {
                                                            color: 'white',
                                                            fontSize: '.8rem',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum EPI encontrado"
                                    loadingText="Carregando EPIs..."
                                />
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
                            <FormControl fullWidth error={!!errors.equipmentIds} sx={{ width: '25%', ...formTheme }}>
                                <Autocomplete
                                    multiple
                                    options={equipamentos || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={equipamentos?.filter((equipamento: any) => field.value?.includes(equipamento.id)) || []}
                                    loading={loadingEquipamentos}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryEquipamentos(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((equipamento: any) => equipamento.id);
                                        field.onChange(selectedIds);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Equipamentos"
                                            error={!!errors.equipmentIds}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingEquipamentos ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    key={option.id}
                                                    label={option.name}
                                                    size="small"
                                                    onDelete={() => {
                                                        const newValue = value.filter((_, i) => i !== index);
                                                        const selectedIds = newValue.map((equipamento: any) => equipamento.id);
                                                        field.onChange(selectedIds);
                                                    }}
                                                    deleteIcon={<IoMdClose onMouseDown={(event: any) => event.stopPropagation()} />}
                                                    sx={{
                                                        backgroundColor: '#00B288',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '.7rem',
                                                        '& .MuiChip-deleteIcon': {
                                                            color: 'white',
                                                            fontSize: '.8rem',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum equipamento encontrado"
                                    loadingText="Carregando equipamentos..."
                                />
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
                            <FormControl fullWidth error={!!errors.vehicleIds} sx={{ width: '25%', ...formTheme }}>
                                <Autocomplete
                                    multiple
                                    options={transportes || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={transportes?.filter((transporte: any) => field.value?.includes(transporte.id)) || []}
                                    loading={loadingVeiculos}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryVeiculos(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((transporte: any) => transporte.id);
                                        field.onChange(selectedIds);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Veículos"
                                            error={!!errors.vehicleIds}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingVeiculos ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    key={option.id}
                                                    label={option.name}
                                                    size="small"
                                                    onDelete={() => {
                                                        const newValue = value.filter((_, i) => i !== index);
                                                        const selectedIds = newValue.map((transporte: any) => transporte.id);
                                                        field.onChange(selectedIds);
                                                    }}
                                                    deleteIcon={<IoMdClose onMouseDown={(event: any) => event.stopPropagation()} />}
                                                    sx={{
                                                        backgroundColor: '#00B288',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '.7rem',
                                                        '& .MuiChip-deleteIcon': {
                                                            color: 'white',
                                                            fontSize: '.8rem',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum veículo encontrado"
                                    loadingText="Carregando veículos..."
                                />
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
                            <FormControl fullWidth error={!!errors.productIds} sx={{ width: '25%', ...formTheme }}>
                                <Autocomplete
                                    multiple
                                    options={produtos || []}
                                    getOptionLabel={(option: any) => option.name || ''}
                                    getOptionKey={(option: any) => option.id}
                                    value={produtos?.filter((produto: any) => field.value?.includes(produto.id)) || []}
                                    loading={loadingProdutos}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQueryProdutos(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((produto: any) => produto.id);
                                        field.onChange(selectedIds);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Produtos"
                                            error={!!errors.productIds}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingProdutos ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.id}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    key={option.id}
                                                    label={option.name}
                                                    size="small"
                                                    onDelete={() => {
                                                        const newValue = value.filter((_, i) => i !== index);
                                                        const selectedIds = newValue.map((produto: any) => produto.id);
                                                        field.onChange(selectedIds);
                                                    }}
                                                    deleteIcon={<IoMdClose onMouseDown={(event: any) => event.stopPropagation()} />}
                                                    sx={{
                                                        backgroundColor: '#00B288',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '.7rem',
                                                        '& .MuiChip-deleteIcon': {
                                                            color: 'white',
                                                            fontSize: '.8rem',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    noOptionsText="Nenhum produto encontrado"
                                    loadingText="Carregando produtos..."
                                />
                                {errors.productIds && (
                                    <p className="text-red-500 text-xs mt-1">{errors.productIds.message}</p>
                                )}
                            </FormControl>
                        )}
                    />
                </Box>


                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Período de Acesso</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Data Ínicio"
                                InputLabelProps={{ shrink: true }}
                                type="date"
                                {...field}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                className="w-[30%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress color="inherit" size={24} /> : "Cadastrar"}
                    </Button>
                </Box>
            </form>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
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
