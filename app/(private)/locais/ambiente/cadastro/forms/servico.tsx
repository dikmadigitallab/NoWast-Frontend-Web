"use client";

import { z } from "zod";
import {
    TextField, Button, Box, Modal, CircularProgress, Chip,
    FormControl, InputLabel, Select, MenuItem, IconButton
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useCreateAmbiente } from "@/app/hooks/locais/ambiente/create";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

const servicoSchema = z.object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    environment: z.object({ connect: z.object({ id: z.number() }) }),
    serviceType: z.object({
        connect: z.object({
            id: z.number().nullable(),
            name: z.string().optional()
        })
    }),
    serviceItens: z.array(z.string()).min(1, "Pelo menos um item de serviço é obrigatório")
});

type ServicoFormValues = z.infer<typeof servicoSchema>;

type ServiceItem = {
    id: number;
    name: string;
};

export default function FormServicos() {
    const router = useRouter();
    const { id } = useGetIDStore();
    const [newItem, setNewItem] = useState("");
    const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
    const { data: tiposServicos } = useGet("serviceType");
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { create, loading } = useCreateAmbiente("service", "/locais/ambiente/listagem");

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<ServicoFormValues>({
        resolver: zodResolver(servicoSchema),
        defaultValues: { name: "", environment: { connect: { id: id } }, serviceType: { connect: { id: null } }, serviceItens: [] }, mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/locais/ambiente/listagem');

    const handleEditItem = (item: ServiceItem) => {
        setEditingItem(item);
        setNewItem(item.name);
    };

    const addServiceItem = () => {
        const text = newItem.trim();
        if (!text) return;

        if (editingItem) {
            const updatedItems = serviceItems.map(item => item.id === editingItem.id ? { ...item, name: text } : item);
            setServiceItems(updatedItems);
            setValue("serviceItens", updatedItems.map(item => item.name));
            setEditingItem(null);
        } else {
            if (!serviceItems.some(item => item.name === text)) {
                const newItemObj = { id: Date.now(), name: text };
                const updatedItems = [...serviceItems, newItemObj];
                setServiceItems(updatedItems);
                setValue("serviceItens", updatedItems.map(item => item.name));
            }
        }
        setNewItem("");
    };

    const removeServiceItem = (name: string) => {
        const updatedItems = serviceItems.filter(item => item.name !== name);
        setServiceItems(updatedItems);
        setValue("serviceItens", updatedItems.map(item => item.name));
        if (editingItem && editingItem.name === name) {
            setEditingItem(null);
            setNewItem("");
        }
    };

    const onSubmit = (formData: ServicoFormValues) => {
        create(formData);
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
                    <IconButton size="small" onClick={() => removeServiceItem(params.row.name)}>
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditItem(params.row)}>
                        <MdOutlineModeEditOutline color='#635D77' size={20} />
                    </IconButton>
                </Box>
            ),
        },
        { field: 'name', headerName: 'Descrição', width: 320 },
    ];

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Serviços</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro de Limpeza</h1>
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

                    <Box className="flex flex-col gap-2">
                        <Box className="flex gap-2 h-[55px]">
                            <TextField
                                label={editingItem ? "Editar Item" : "Novo Item de Serviço"}
                                variant="outlined"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                sx={[formTheme, { height: "100%" }]}
                                fullWidth
                            />
                            <Button
                                variant="outlined"
                                onClick={addServiceItem}
                                sx={[buttonTheme, { height: "100%" }]}
                            >
                                {editingItem ? "Atualizar" : "Adicionar"}
                            </Button>
                            {editingItem && (
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setEditingItem(null);
                                        setNewItem("");
                                    }}
                                    sx={[buttonThemeNoBackground, { height: "100%" }]}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </Box>

                        {errors.serviceItens && (
                            <p className="text-red-500 text-sm">{errors.serviceItens.message}</p>
                        )}
                    </Box>
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
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
                    </Button>
                </Box>
            </form>

            <Modal open={openDisableModal} onClose={handleCloseDisableModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}