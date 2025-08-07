"use client";

import z from "zod";
import {
    TextField, Button, Box, Modal, CircularProgress, Chip,
    FormControl, InputLabel, Select, MenuItem, IconButton
} from "@mui/material";
import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useUpdateAmbiente } from "@/app/hooks/locais/ambiente/update";
import { GoTrash } from "react-icons/go";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const servicoSchema = z.object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    environment: z.object({ connect: z.object({ id: z.number() }) }),
    serviceType: z.object({
        connect: z.object({
            id: z.number().nullable(),
            name: z.string().optional()
        })
    }),
    serviceItens: z.object({
        create: z.array(z.object({
            name: z.string().min(1, "Pelo menos um item de serviço é obrigatório")
        }))
    })
});

type ServicoFormValues = z.infer<typeof servicoSchema>;

type ServiceItem = {
    id: number;
    name: string;
};

export default function FormServicos() {
    const router = useRouter();
    const { id } = useGetIDStore();
    const { data: servico } = useGetOneById("service");
    const { data: tiposServicos } = useGet({ url: "serviceType" });
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const { update, loading } = useUpdateAmbiente("service", "/locais/ambiente/listagem");
    const [selectedState, setSelectedState] = useState<{ services: string[] }>({ services: [] });
    const [servicesFromApi, setServicesFromApi] = useState<any[]>([]);


    const { control, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<ServicoFormValues>({
        resolver: zodResolver(servicoSchema),
        defaultValues: {
            name: "",
            environment: { connect: { id: id } },
            serviceType: { connect: { id: null } },
            serviceItens: { create: [] }
        },
        mode: "onChange"
    });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/locais/ambiente/listagem');

    const handleRemoveSelected = (value: string) => {
        setSelectedState(prev => ({
            ...prev,
            services: prev.services.filter(id => id !== value)
        }));
    };

    const renderChips = () => {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedState.services.map((value) => {
                    const selectedItem = servicesFromApi?.find(item => item.id.toString() === value);
                    return (
                        <Chip
                            key={value}
                            label={selectedItem ? selectedItem.name : `ID: ${value}`}
                            onDelete={() => handleRemoveSelected(value)}
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
                    );
                })}
            </Box>
        );
    };

    const handleAddServices = () => {
        if (selectedState.services.length === 0) return;

        const serviceToAdd = servicesFromApi?.filter((service) =>
            selectedState.services.includes(service.id.toString()) &&
            !serviceItems.some(existingService => existingService.id.toString() === service.id.toString())
        );

        if (serviceToAdd.length > 0) {
            const updatedServices = [...serviceItems, ...serviceToAdd.map((service) => ({
                id: service.id,
                name: service.name
            }))];

            setServiceItems(updatedServices);
            setValue("serviceItens", {
                create: updatedServices.map(service => ({ name: service.name }))
            });
            setSelectedState(prev => ({ ...prev, services: [] }));
        }
    };

    const handleRemoveService = (serviceId: string) => {
        const updatedItems = serviceItems.filter(item => item.id.toString() !== serviceId);
        setServiceItems(updatedItems);
        setValue("serviceItens", {
            create: updatedItems.map(item => ({ name: item.name }))
        });
    };

    const columns: GridColDef<ServiceItem>[] = [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 70,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" onClick={() => handleRemoveService(params.row.id.toString())}>
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                </Box>
            ),
        },
        { field: 'name', headerName: 'Descrição', width: 320 },
    ];

    useEffect(() => {

        setServicesFromApi(servico?.serviceItems);
        const initialItems = servicesFromApi?.map((item) => ({
            id: item.id,
            name: item.name
        }));

        setServiceItems(initialItems);
        setValue("serviceItens", {
            create: initialItems.map(item => ({ name: item.name }))
        });

        if (servico) {
            reset({
                ...servico,
                environment: { connect: { id: servico.environmentId } },
                serviceType: { connect: { id: servico.serviceTypeId } }
            });
        } else {
            reset({
                name: "Serviço de Limpeza",
                environment: { connect: { id: id } },
                serviceType: { connect: { id: 1 } },
                serviceItens: { create: initialItems.map(item => ({ name: item.name })) }
            });
        }
    }, [servico, reset, id, setValue]);

    const onSubmit = (formData: ServicoFormValues) => {
        console.log("Dados enviados:", formData);
        update(formData);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Serviços</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar de Limpeza</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Serviço"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="serviceType.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl sx={formTheme} fullWidth error={!!errors.serviceType?.connect?.id}>
                                <InputLabel id="service-type-label">Tipo de Serviço</InputLabel>
                                <Select
                                    labelId="service-type-label"
                                    label="Tipo de Serviço"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        Clique e selecione...
                                    </MenuItem>
                                    {tiposServicos?.map((type: any) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.serviceType?.connect?.id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.serviceType.connect.id.message}
                                    </p>
                                )}
                            </FormControl>
                        )}
                    />

                    <Box className="flex flex-col gap-3">
                        <Box className="flex items-center gap-2">
                            <Box className="w-[15px] h-[15px] bg-[#3aba8a]" />
                            <span className="text-[#3aba8a] font-bold">Checklist</span>
                            <Box className="flex-1 h-[1px] bg-[#3aba8a]" />
                        </Box>
                        <Box className="flex flex-row gap-3 h-[60px]">
                            <FormControl sx={formTheme} fullWidth>
                                <InputLabel>Checklist</InputLabel>
                                <Select
                                    label="Checklist"
                                    multiple
                                    value={selectedState.services}
                                    onChange={(e) =>
                                        setSelectedState(prev => ({
                                            ...prev,
                                            services: e.target.value as string[]
                                        }))
                                    }
                                    renderValue={renderChips}
                                >
                                    <MenuItem value="" disabled>Selecione serviços...</MenuItem>
                                    {servicesFromApi?.map((service) => (
                                        <MenuItem key={service.id} value={service.id.toString()}>
                                            {service.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                sx={[buttonTheme, { height: "90%" }]}
                                onClick={handleAddServices}
                            >
                                <FiPlus size={25} color="#fff" />
                            </Button>
                        </Box>
                    </Box>

                    {errors.serviceItens && (
                        <p className="text-red-500 text-sm">{errors.serviceItens.message}</p>
                    )}
                </Box>

                <Box>
                    <DataGrid
                        rows={serviceItems}
                        columns={columns}
                        getRowId={(row) => row.id}
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
                </Box>

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Atualizar"}
                    </Button>
                </Box>
            </form>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar essa edição? Todas as alterações serão perdidas.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}