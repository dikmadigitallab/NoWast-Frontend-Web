"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText, Modal, CircularProgress, Checkbox, ListItemText, InputAdornment } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { set, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useAuthStore } from "@/app/store/storeApp";
import { useUpdateUser } from "@/app/hooks/usuarios/update";
import { ImageUploader } from "@/app/components/imageGet";
import { useDebounce } from "@/app/utils/useDebounce";

const userSchema = z.object({
    id: z.number({ required_error: "ID é obrigatório", invalid_type_error: "ID inválido" }),
    password: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "A senha deve ter pelo menos 6 caracteres"
    }),
    confirmPassword: z.string().optional(),
    userType: z.enum(["DIKMA_ADMINISTRATOR", "CONTRACT_MANAGER", "DIKMA_DIRECTOR", "CLIENT_ADMINISTRATOR", "OPERATIONAL"], { required_error: "Tipo de usuário é obrigatório", invalid_type_error: "Tipo de usuário inválido" }),
    status: z.enum(["ACTIVE", "INACTIVE"], { required_error: "Status é obrigatório", invalid_type_error: "Status inválido", }),
    source: z.string().optional(),
    startDate: z.string({ message: "Data de início é obrigatória" }).optional(),
    endDate: z.string({ message: "Data de fim é obrigatória" }).optional(),
    firstLogin: z.boolean({ required_error: "Indicação de primeiro login é obrigatória" }),
    person: z.object({
        create: z.object({
            name: z.string().min(1, { message: "O nome é obrigatório" }),
            tradeName: z.string({ message: "Nome Fantasia é obrigatório" }).optional(),
            document: z.string().min(11, { message: "Documento deve ter pelo menos 11 caracteres" }),
            briefDescription: z.string().min(1, { message: "Descrição é obrigatória" }),
            birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
            gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Gênero é obrigatório", invalid_type_error: "Gênero inválido" }),
            personType: z.enum(["INDIVIDUAL", "COMPANY"], { required_error: "Tipo de pessoa é obrigatório", invalid_type_error: "Tipo de pessoa inválido" }),
            email: z.string().email({ message: "Email inválido" }),
            phone: z.string().min(7, { message: "Telefone inválido" }),
            address: z.object({
                address: z.string().min(9, { message: "Endereço é obrigatório" }),
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
    role: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do papel inválido", required_error: "Selecione um cargo" }).min(1, { message: "Selecione um cargo" }) }) }),
    contract: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do contrato inválido", required_error: "Selecione um contrato" }).min(1, { message: "Selecione um contrato" }).optional() }).optional() }).optional(),
    position: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do cargo inválido", required_error: "Selecione uma posição" }).min(1, { message: "Selecione uma posição" }).optional() }).optional() }).optional(),
    supervisor: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do supervisor inválido", required_error: "Selecione um supervisor" }).min(1, { message: "Selecione um supervisor" }).optional() }).optional() }).optional(),
    manager: z.object({ connect: z.object({ id: z.number({ invalid_type_error: "ID do gerente inválido", required_error: "Selecione um gerente" }).min(1, { message: "Selecione um gerente" }).optional() }).optional() }).optional(),
    epiIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    equipmentIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    vehicleIds: z.array(z.number({ invalid_type_error: "ID de veículo inválido" }).optional()),
    productIds: z.array(z.number({ invalid_type_error: "ID de produto inválido" }).optional())
}).refine((data) => {
    // Se a senha foi preenchida, a confirmação também deve ser preenchida e igual
    if (data.password && data.password.length > 0) {
        return data.confirmPassword === data.password;
    }
    return true;
}, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AtualizarPessoa() {

    const { userInfo } = useAuthStore();

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue, trigger } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: undefined,
            password: "",
            confirmPassword: "",
            userType: undefined,
            status: "ACTIVE",
            source: "",
            firstLogin: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: "",
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
                }
            },
            role: { connect: { id: Number(userInfo?.contractId) } },
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

    const router = useRouter();
    const { users: usersRaw, loading: loadingUsers } = useGetUsuario({
        query: debouncedSearchQuerySupervisor || debouncedSearchQueryManager,
        pageSize: 25,
        pageNumber: 1
    });
    
    // Remove duplicatas baseadas no ID
    const users = usersRaw ? usersRaw.filter((user: any, index: number, self: any[]) => 
        index === self.findIndex((u: any) => u.id === user.id)
    ) : [];
    
    const { data } = useGetOneById('users');
    
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

    const [disable, setDisable] = useState(false);
    const [tempEndDate, setTempEndDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [cepLoading, setCepLoading] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { update, loading } = useUpdateUser("users", '/usuario/listagem');
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const handleOpenModal = (field: string) => {
        if (field === "cancelar") {
            setOpenCancelModal(true);
        } else {
            setTempEndDate(new Date().toISOString().split('T')[0]);
            setOpenDisableModal(true);
        }
    };

    const handleCloseModal = (field: string) => {
        if (field === "cancelar") {
            setOpenCancelModal(false);
        } else {
            setOpenDisableModal(false);
        }
    };

    const handleConfirmDisable = () => {
        setDisable(true);
        setValue("endDate", tempEndDate);
        setOpenDisableModal(false);
    };

    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/usuario/listagem');

    const onSubmit = (formData: UserFormValues) => {
        if (disable) {
            const { password, confirmPassword, ...formDataWithoutPassword } = formData;
            const newData = {
                ...formDataWithoutPassword,
                file: file,
                status: "INACTIVE",
                email: formData.person.create.email?.toLowerCase(),
                phone: formData.person.create.phone?.replace(/[.\-]/g, ''),
                // Só inclui a senha se ela foi preenchida
                ...(password && { password }),
                person: {
                    create: {
                        ...formData.person.create, document: formData.person.create.document?.replace(/[.\-]/g, ''),
                        birthDate: new Date(formData.person.create.birthDate).toISOString()
                    }
                }
            };
            update(newData, file);
        } else {
            const { password, confirmPassword, ...formDataWithoutPassword } = formData;
            const newData = {
                ...formDataWithoutPassword,
                file: file,
                email: formData.person.create.email?.toLowerCase(),
                phone: formData.person.create.phone?.replace(/[.\-]/g, ''),
                // Só inclui a senha se ela foi preenchida
                ...(password && { password }),
                person: {
                    create: {
                        ...formData.person.create, document: formData.person.create.document?.replace(/[.\-]/g, ''),
                        birthDate: new Date(formData.person.create.birthDate).toISOString()
                    }
                }
            };
            update(newData, file);
        }
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

    const formatCpfOrCnpj = (value: string) => {
        const type = watch('person.create.personType');
        const digits = value?.replace(/\D/g, '');

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

    useEffect(() => {
        if (data) {

            const { id, status, person, role, firstLogin, ppes, tools, transports, products, position, userType, contractId, supervisor, manager, startDate } = data;
            const { name, tradeName, document, briefDescription, birthDate, gender, personType } = person;
            const phones = person.phones.map((phone: any) => phone.phoneNumber);
            const epis = ppes.map((epi: any) => epi.id)
            const ferramentas = tools.map((ferramenta: any) => ferramenta.id)
            const transportes = transports.map((transporte: any) => transporte.id)
            const produtos = products.map((produto: any) => produto.id)

            setValue('id', id);
            setValue('status', status);
            setValue('person.create.name', name);
            setValue('person.create.tradeName', tradeName);
            setValue('person.create.document', document);
            setValue('person.create.briefDescription', briefDescription);
            setValue('person.create.birthDate', formatDateForInput(birthDate));
            setValue('person.create.gender', gender);
            setValue('person.create.personType', personType);
            setValue('role.connect.id', role.id);
            setValue('firstLogin', firstLogin);
            setValue('person.create.email', data.email);
            setValue('person.create.phone', phones[0]);
            setValue('epiIds', epis)
            setValue('equipmentIds', ferramentas)
            setValue('vehicleIds', transportes)
            setValue('productIds', produtos)
            setValue('position.connect.id', position.id)
            setValue('userType', userType)
            setValue('contract.connect.id', contractId)
            setValue('supervisor.connect.id', supervisor.id)
            setValue('manager.connect.id', manager.id)
            setValue('startDate', startDate ? formatDateForInput(startDate) : new Date().toISOString().split('T')[0])

            if (data.person.addresses.length > 0) {
                setValue('person.create.address.city', data.person.addresses[0].city)
                setValue('person.create.address.state', data.person.addresses[0].state)
                setValue('person.create.address.number', data.person.addresses[0].number)
                setValue('person.create.address.address', data.person.addresses[0].address)
                setValue('person.create.address.country', data.person.addresses[0].country)
                setValue('person.create.address.district', data.person.addresses[0].district)
                setValue('person.create.address.latitude', data.person.addresses[0].latitude)
                setValue('person.create.address.longitude', data.person.addresses[0].longitude)
                setValue('person.create.address.complement', data.person.addresses[0].complement)
                setValue('person.create.address.postalCode', data.person.addresses[0].postalCode)
                setValue('person.create.address.stateAbbreviation', data.person.addresses[0].stateAbbreviation)
            }

            setImageInfo({
                size: data.userFiles[0]?.file?.size,
                name: data.userFiles[0]?.file?.fileName,
                type: data.userFiles[0]?.file?.fileType,
                previewUrl: data.userFiles[0]?.file?.url
            });


        }
    }, [data, reset]);


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
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoa</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Informações Pessoais</h2>

                <Box className="w-[100%] flex flex-row gap-5">

                    <ImageUploader
                        defaultValue={imageInfo}
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
                            <FormControl fullWidth error={!!errors.person?.create?.personType} sx={formTheme}>
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
                            <FormControl fullWidth error={!!errors.person?.create?.gender} sx={formTheme}>
                                <InputLabel>Gênero</InputLabel>
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
                                label="Nova Senha (opcional)"
                                type="password"
                                {...field}
                                error={!!errors.password}
                                helperText={errors.password?.message || "Deixe em branco para manter a senha atual"}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Confirmar Nova Senha"
                                type="password"
                                {...field}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message || "Confirme a nova senha"}
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
                            <FormControl fullWidth sx={formTheme}>
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
                    <Controller
                        name="firstLogin"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth sx={formTheme}>
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
                                disabled={cepLoading}
                                error={!!errors.person?.create?.address?.postalCode}
                                helperText={errors.person?.create?.address?.postalCode?.message}
                                className="w-full"
                                sx={formTheme}
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
                            <FormControl fullWidth error={!!errors.person?.create?.address?.addressType} sx={formTheme}>
                                <InputLabel>Tipo de Endereço</InputLabel>
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
                            <CustomAutocomplete
                                options={cargos || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={cargos?.find((cargo: any) => cargo.id === field.value) || null}
                                loading={loadingCargos}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryCargos(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Cargo"
                                error={!!errors.position?.connect?.id}
                                helperText={errors.position?.connect?.id?.message}
                                noOptionsText="Nenhum cargo encontrado"
                                loadingText="Carregando cargos..."
                                className="w-full"
                            />
                        )}
                    />
                    <Controller
                        name="userType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.userType} sx={formTheme}>
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
                </Box>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="supervisor.connect.id"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                options={users || []}
                                getOptionLabel={(option: any) => option.person?.name || ''}
                                value={users?.find((user: any) => user.id === field.value) || null}
                                loading={loadingUsers}
                                onInputChange={(newInputValue) => {
                                    setSearchQuerySupervisor(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Supervisor"
                                error={!!errors.supervisor?.connect?.id}
                                helperText={errors.supervisor?.connect?.id?.message}
                                noOptionsText="Nenhum supervisor encontrado"
                                loadingText="Carregando supervisores..."
                                className="w-full"
                            />
                        )}
                    />
                    <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                options={users || []}
                                getOptionLabel={(option: any) => option.person?.name || ''}
                                value={users?.find((user: any) => user.id === field.value) || null}
                                loading={loadingUsers}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryManager(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Gerente"
                                error={!!errors?.manager?.connect?.id}
                                helperText={errors?.manager?.connect?.id?.message}
                                noOptionsText="Nenhum gerente encontrado"
                                loadingText="Carregando gerentes..."
                                className="w-full"
                            />
                        )}
                    />
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Vínculo de Itens</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="epiIds"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                multiple
                                multipleValue={epis?.filter((epi: any) => field.value?.includes(epi.id)) || []}
                                onMultipleChange={(newValue) => {
                                    const selectedIds = newValue.map((epi: any) => epi.id);
                                    field.onChange(selectedIds);
                                }}
                                options={epis || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                loading={loadingEpis}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryEpis(newInputValue);
                                }}
                                label="EPIs"
                                error={!!errors.epiIds}
                                helperText={errors.epiIds?.message}
                                noOptionsText="Nenhum EPI encontrado"
                                loadingText="Carregando EPIs..."
                                className="w-[25%]"
                            />
                        )}
                    />
                    <Controller
                        name="equipmentIds"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                multiple
                                multipleValue={equipamentos?.filter((equipamento: any) => field.value?.includes(equipamento.id)) || []}
                                onMultipleChange={(newValue) => {
                                    const selectedIds = newValue.map((equipamento: any) => equipamento.id);
                                    field.onChange(selectedIds);
                                }}
                                options={equipamentos || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                loading={loadingEquipamentos}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryEquipamentos(newInputValue);
                                }}
                                label="Equipamentos"
                                error={!!errors.equipmentIds}
                                helperText={errors.equipmentIds?.message}
                                noOptionsText="Nenhum equipamento encontrado"
                                loadingText="Carregando equipamentos..."
                                className="w-[25%]"
                            />
                        )}
                    />

                    <Controller
                        name="vehicleIds"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                multiple
                                multipleValue={transportes?.filter((transporte: any) => field.value?.includes(transporte.id)) || []}
                                onMultipleChange={(newValue) => {
                                    const selectedIds = newValue.map((transporte: any) => transporte.id);
                                    field.onChange(selectedIds);
                                }}
                                options={transportes || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                loading={loadingVeiculos}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryVeiculos(newInputValue);
                                }}
                                label="Veículos"
                                error={!!errors.vehicleIds}
                                helperText={errors.vehicleIds?.message}
                                noOptionsText="Nenhum veículo encontrado"
                                loadingText="Carregando veículos..."
                                className="w-[25%]"
                            />
                        )}
                    />

                    <Controller
                        name="productIds"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                multiple
                                multipleValue={produtos?.filter((produto: any) => field.value?.includes(produto.id)) || []}
                                onMultipleChange={(newValue) => {
                                    const selectedIds = newValue.map((produto: any) => produto.id);
                                    field.onChange(selectedIds);
                                }}
                                options={produtos || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                loading={loadingProdutos}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryProdutos(newInputValue);
                                }}
                                label="Produtos"
                                error={!!errors.productIds}
                                helperText={errors.productIds?.message}
                                noOptionsText="Nenhum produto encontrado"
                                loadingText="Carregando produtos..."
                                className="w-[25%]"
                            />
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
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                disabled={!disable}
                                variant="outlined"
                                label="Data Fim"
                                InputLabelProps={{ shrink: true }}
                                type="date"
                                {...field}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                className="w-full"
                                sx={[formTheme, { opacity: disable ? 1 : 0.8 }]}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => handleOpenModal("desabilitar")}>Desabilitar</Button>
                    <Box className="flex flex-row gap-5">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => handleOpenModal("cancelar")}>Cancelar</Button>
                        <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]} disabled={loading}>
                            {loading ? <CircularProgress color="inherit" size={24} /> : "Salvar"}
                        </Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openDisableModal} onClose={() => handleCloseModal("desabilitar")} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Desabilitar Usuário</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente desabilitar esse usuário?</p>
                        <TextField
                            variant="outlined"
                            label="Data Fim"
                            InputLabelProps={{ shrink: true }}
                            type="date"
                            value={tempEndDate}
                            onChange={(e) => setTempEndDate(e.target.value)}
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                            className="w-full"
                            sx={[formTheme]}
                        />
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={() => handleCloseModal("desabilitar")} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button
                                variant="outlined"
                                onClick={handleConfirmDisable}
                                sx={buttonTheme}
                                disabled={!tempEndDate}
                            >
                                {loading ? <CircularProgress color="inherit" size={24} /> : "Confirmar"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    )
}