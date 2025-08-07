"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText, Modal, CircularProgress, Checkbox, ListItemText, InputAdornment } from "@mui/material";
import { set, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground, buttonThemeNoBackgroundError } from "@/app/styles/buttonTheme/theme";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useGetContratos } from "@/app/hooks/contrato/get";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { useUpdate } from "@/app/hooks/crud/update/update";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { IoImagesOutline } from "react-icons/io5";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";

const userSchema = z.object({
    id: z.number({ required_error: "ID é obrigatório", invalid_type_error: "ID inválido" }),
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

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: undefined,
            userType: undefined,
            status: "ACTIVE",
            source: "",
            firstLogin: true,
            startDate: "",
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

    const router = useRouter();
    const { users } = useGetUsuario({});
    const { data } = useGetOneById('users');
    const { data: contrato } = useGetContratos();
    const { data: epis } = useGet({ url: 'ppe' });
    const [disable, setDisable] = useState(false);
    const [tempEndDate, setTempEndDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [cepLoading, setCepLoading] = useState(false);
    const { data: cargos } = useGet({ url: 'position' });
    const { data: produtos } = useGet({ url: 'product' });
    const { data: equipamentos } = useGet({ url: 'tools' });
    const { data: transportes } = useGet({ url: 'transport' });
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { update, loading } = useUpdate("users", '/usuario/listagem');
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const handleOpenModal = (field: string) => {
        if (field === "cancelar") {
            setOpenCancelModal(true);
        } else {
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
            const newData = {
                ...formData,
                status: "INACTIVE",
                email: formData.person.create.email?.toLowerCase(),
                phone: formData.person.create.phone?.replace(/[.\-]/g, ''),
                person: {
                    create: {
                        ...formData.person.create, document: formData.person.create.document?.replace(/[.\-]/g, ''),
                        birthDate: new Date(formData.person.create.birthDate).toISOString()
                    }
                }
            };
            update(newData);
        } else {
            const newData = {
                ...formData,
                email: formData.person.create.email?.toLowerCase(),
                phone: formData.person.create.phone?.replace(/[.\-]/g, ''),
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
        if (cep.length < 9) return;

        try {
            setCepLoading(true);
            const cleanedCep = cep.replace(/\D/g, '');
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
            const viaCepData = await viaCepResponse.json();

            if (viaCepData.erro) return;

            const fullAddress = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade}-${viaCepData.uf}, Brasil`;

            const geocodeResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=br`
            );
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
            setCepLoading(false);
        }
    }

    useEffect(() => {
        if (data) {

            const { id, status, person, role, firstLogin, ppes, tools, transports, products, position, userType, contractId, supervisor, manager } = data;
            const { name, tradeName, document, briefDescription, birthDate, gender, personType } = person;
            const phones = person.phones.map((phone: any) => phone.phoneNumber);
            const emails = person.emails.map((email: any) => email.email);
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
            setValue('person.create.email', emails[0]);
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageData = {
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
        };
        setImageInfo(imageData);
        setFile(file);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoa</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Informações da Pessoa</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Box className="w-full  h-[57px] flex  items-center border border-dashed relative border-[#5e58731f] rounded-lg cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                            onChange={handleFileChange}
                        />
                        {imageInfo ? (
                            <Box className="absolute w-full flex justify-between items-center p-3">
                                <Box className="flex flex-row items-center gap-3">
                                    <img src={imageInfo.previewUrl} alt="Preview" className="w-[30px] h-[30px]" />
                                    <Box className="flex flex-col">
                                        <p className="text-[.8rem] text-[#000000]">Nome: {imageInfo.name}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tipo: {imageInfo.type}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tamanho: {(imageInfo.size / 1024).toFixed(2)} KB</p>
                                    </Box>
                                </Box>
                                <IoMdClose color="#5E5873" onClick={() => setImageInfo(null)} />
                            </Box>
                        )
                            :
                            <Box className="absolute w-full flex justify-center items-center p-3 gap-2 pointer-events-none">
                                <IoImagesOutline color="#5E5873" size={25} />
                                <p className="text-[.8rem] text-[#000000]">Selecione uma imagem</p>
                            </Box>
                        }
                    </Box>

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

                <h2 className="text-[#5E5873] text-[1.2rem] font-normal mt-4">Relação Funcional</h2>

                <Box className="w-[100%] flex flex-row gap-5">
                    <Controller
                        name="position.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.position?.connect?.id} sx={formTheme}>
                                <InputLabel>Cargo</InputLabel>
                                <Select
                                    label="Cargo"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value={field.value || []} disabled>Selecione uma posição...</MenuItem>
                                    {cargos?.map((position: any) => (
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
                    <Controller
                        name="contract.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.contract?.connect?.id} sx={formTheme}>
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
                        name="supervisor.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.supervisor?.connect?.id} sx={formTheme}>
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
                    <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors?.manager?.connect?.id} sx={formTheme}>
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
                            <FormControl fullWidth error={!!errors.epiIds} sx={{ width: '25%', ...formTheme }}>
                                <InputLabel>EPIs</InputLabel>
                                <Select
                                    multiple
                                    label="EPIs"
                                    input={<OutlinedInput sx={formTheme} label="EPIs" />}
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
                            <FormControl fullWidth error={!!errors.equipmentIds} sx={{ width: '25%', ...formTheme }}>
                                <InputLabel>Equipamentos</InputLabel>
                                <Select
                                    multiple
                                    label="Equipamentos"
                                    input={<OutlinedInput sx={formTheme} label="Equipamentos" />}
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
                            <FormControl fullWidth error={!!errors.vehicleIds} sx={{ width: '25%', ...formTheme }}>
                                <InputLabel>Veículos</InputLabel>
                                <Select
                                    multiple
                                    label="Veículos"
                                    input={<OutlinedInput sx={formTheme} label="Veículos" />}
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
                            <FormControl fullWidth error={!!errors.productIds} sx={{ width: '25%', ...formTheme }}>
                                <InputLabel>Produtos</InputLabel>
                                <Select
                                    multiple
                                    label="Produtos"
                                    input={<OutlinedInput sx={formTheme} label="Produtos" />}
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