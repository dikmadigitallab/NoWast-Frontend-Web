"use client";

import { TextField, Button, Box, Modal, CircularProgress, Chip, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useUpdateService } from "@/app/hooks/servicos/update";
import { formTheme } from "@/app/styles/formTheme/theme";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { ptBR } from "@mui/x-data-grid/locales";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/app/utils/useDebounce";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import z from "zod";

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
            name: z.string()
        })).optional(),
        update: z.array(z.object({
            id: z.number(),
            update: z.object({
                name: z.string()
            })
        })).optional(),
        delete: z.array(z.object({
            id: z.number()
        })).optional()
    })
});

type ServicoFormValues = z.infer<typeof servicoSchema>;

type ServiceItem = {
    id: number;
    name: string;
};

export default function FormServicos() {

    const router = useRouter();
    const { id, setId } = useGetIDStore();
    
    // Buscar o ambiente - mesma lógica do page.tsx de listagem
    const { data: ambienteData } = useGet({ 
        url: "environment",
        disablePagination: true
    });

    // Filtrar o ambiente específico pelo ID
    const ambiente = ambienteData?.find((amb: any) => amb.id === id);
    const servicosDoAmbiente = ambiente?.servicos || [];
    
    // Pegar o primeiro serviço (ou ajustar lógica para selecionar qual serviço editar)
    const primeiroServico = servicosDoAmbiente[0];
    
    // Buscar os serviceItems (checklists) do serviço - mesma lógica do modal
    const { data: servicoComChecklists } = useGetOneById("service");

    // Debug
    console.log("=== DEBUG ===");
    console.log("id do ambiente:", id);
    console.log("ambiente:", ambiente);
    console.log("servicos do ambiente:", servicosDoAmbiente);
    console.log("primeiro serviço:", primeiroServico);
    console.log("servico com checklists:", servicoComChecklists);

    // useEffect para definir o ID do serviço quando o componente carrega
    useEffect(() => {
        if (primeiroServico && primeiroServico.id) {
            console.log("Definindo ID do serviço:", primeiroServico.id);
            setId(primeiroServico.id);
        }
    }, [primeiroServico, setId]);
    const [searchQueryTiposServicos, setSearchQueryTiposServicos] = useState('');
    const debouncedSearchQueryTiposServicos = useDebounce(searchQueryTiposServicos, 500);
    
    const { data: tiposServicosRaw, loading: loadingTiposServicos } = useGet({ 
        url: "serviceType",
        query: debouncedSearchQueryTiposServicos,
        pageSize: 100,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const tiposServicos = tiposServicosRaw ? tiposServicosRaw.filter((tipo: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === tipo.id)
    ) : [];

    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const [originalItems, setOriginalItems] = useState<ServiceItem[]>([]); // Itens originais da API
    const [deletedItems, setDeletedItems] = useState<number[]>([]); // IDs dos itens deletados
    const [newItem, setNewItem] = useState("");
    const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
    const { update, loading } = useUpdateService("/locais/ambiente/listagem");

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<ServicoFormValues>({
        resolver: zodResolver(servicoSchema),
        defaultValues: {
            name: "",
            environment: { connect: { id: id } },
            serviceType: { connect: { id: null, name: "" } },
            serviceItens: { update: [] }
        },
        mode: "onChange"
    });


    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/locais/ambiente/listagem');

    // Helper para verificar se o ID é temporário (gerado pelo Date.now())
    const isTemporaryId = (id: number) => id > 1000000000000;

    const handleEditItem = (item: ServiceItem) => {
        setEditingItem(item);
        setNewItem(item.name);
    };

    const addServiceItem = () => {
        const text = newItem.trim();
        if (!text) return;

        if (editingItem) {
            // Editando item existente
            const updatedItems = serviceItems.map(item => 
                item.id === editingItem.id ? { ...item, name: text } : item
            );
            setServiceItems(updatedItems);
            setEditingItem(null);
        } else {
            // Adicionando novo item
            if (!serviceItems.some(item => item.name === text)) {
                const newItemObj = { id: Date.now(), name: text };
                const updatedItems = [...serviceItems, newItemObj];
                setServiceItems(updatedItems);
            }
        }
        setNewItem("");
    };

    const removeServiceItem = (name: string) => {
        const itemToRemove = serviceItems.find(item => item.name === name);
        
        if (itemToRemove) {
            // Se for um item da API (não temporário), adicionar ao array de deletados
            if (!isTemporaryId(itemToRemove.id)) {
                setDeletedItems(prev => [...prev, itemToRemove.id]);
            }
            
            // Remover da lista
            const updatedItems = serviceItems.filter(item => item.name !== name);
            setServiceItems(updatedItems);
            
            if (editingItem && editingItem.name === name) {
                setEditingItem(null);
                setNewItem("");
            }
        }
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

    useEffect(() => {
        if (servicoComChecklists && servicoComChecklists.serviceItems) {
            console.log("=== CARREGANDO CHECKLISTS ===");
            console.log("servico com checklists:", servicoComChecklists);
            console.log("serviceItems:", servicoComChecklists.serviceItems);

            const initialItems = servicoComChecklists.serviceItems.map((item: any) => ({
                id: item.id,
                name: item.name
            }));

            console.log("initialItems mapeados:", initialItems);

            // Salvar itens originais e atuais
            setOriginalItems(initialItems);
            setServiceItems(initialItems);

            // Usar os dados do serviço completo para o formulário
            reset({
                name: servicoComChecklists.name || primeiroServico?.name || "",
                environment: { connect: { id: id } },
                serviceType: { connect: { 
                    id: servicoComChecklists.serviceTypeId || servicoComChecklists.serviceType?.id || null, 
                    name: servicoComChecklists.serviceTypeName || servicoComChecklists.serviceType?.name || "" 
                } },
                serviceItens: {
                    create: [],
                    update: [],
                    delete: []
                }
            });
        }
    }, [servicoComChecklists, primeiroServico, reset, id]);

    const onSubmit = (formData: ServicoFormValues) => {
        console.log("=== ON SUBMIT ===");
        console.log("serviceItems atuais:", serviceItems);
        console.log("originalItems:", originalItems);
        console.log("deletedItems:", deletedItems);
        
        const serviceId = servicoComChecklists?.id || primeiroServico?.id;
        
        if (!serviceId) {
            console.error("ID do serviço não encontrado!");
            return;
        }

        // Separar itens em create, update, delete
        const createItems: { name: string }[] = [];
        const updateItems: { id: number; update: { name: string } }[] = [];

        serviceItems.forEach(item => {
            if (isTemporaryId(item.id)) {
                // Item novo (create)
                createItems.push({ name: item.name });
            } else {
                // Item existente - verificar se foi modificado
                const originalItem = originalItems.find(orig => orig.id === item.id);
                if (originalItem && originalItem.name !== item.name) {
                    // Item foi modificado (update)
                    updateItems.push({
                        id: item.id,
                        update: { name: item.name }
                    });
                } else if (originalItem) {
                    // Item não foi modificado, mas ainda precisa estar no update
                    updateItems.push({
                        id: item.id,
                        update: { name: item.name }
                    });
                }
            }
        });

        // Itens deletados
        const deleteItems = deletedItems.map(id => ({ id }));

        // Construir payload final
        const payload = {
            ...formData,
            serviceItens: {
                ...(createItems.length > 0 && { create: createItems }),
                ...(updateItems.length > 0 && { update: updateItems }),
                ...(deleteItems.length > 0 && { delete: deleteItems })
            }
        };

        console.log("=== PAYLOAD FINAL ===");
        console.log(JSON.stringify(payload, null, 2));
        
        update(serviceId, payload);
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
                                label="Tipo de Ambiente"
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
                            <CustomAutocomplete
                                options={tiposServicos || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={tiposServicos?.find((tipo: any) => tipo.id === field.value) || null}
                                loading={loadingTiposServicos}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryTiposServicos(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Tipo de Serviço"
                                error={!!errors.serviceType?.connect?.id}
                                helperText={errors.serviceType?.connect?.id?.message}
                                noOptionsText="Nenhum tipo encontrado"
                                loadingText="Carregando tipos..."
                                className="w-full"
                            />
                        )}
                    />

                    <Box className="flex flex-col gap-2">
                        <Box className="flex gap-2 h-[55px]">
                            <TextField
                                label={editingItem ? "Editar Item" : "Novo Item de Checklist"}
                                variant="outlined"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addServiceItem();
                                    }
                                }}
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
                        pageSizeOptions={[5, 25, 100]}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}
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
