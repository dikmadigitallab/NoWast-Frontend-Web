import { useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, FormHelperText, Collapse, Chip } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { formTheme } from "@/app/styles/formTheme/theme";
import { tableTheme } from '@/app/styles/tableTheme/theme';
import { IoMdClose } from 'react-icons/io';

export default function FormItens({ control, setValue, watch, formState: { errors } }: { control?: any, setValue?: any, watch?: any, formState: { errors?: any } }) {

    const { data: epis } = useGet({ url: "ppe" });
    const { data: equipamentos } = useGet({ url: "tools" });
    const { data: produtos } = useGet({ url: "product" });
    const { data: transportes } = useGet({ url: "transport" });

    const [selectedItems, setSelectedItems] = useState({
        epi: [] as number[],
        equipamento: [] as number[],
        produto: [] as number[],
        transporte: [] as number[]
    });

    const [expandedSections, setExpandedSections] = useState({
        epis: true,
        equipamentos: false,
        produtos: false,
        transportes: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleAddItems = (type: 'epis' | 'equipamentos' | 'produtos' | 'transportes') => {
        const fieldMap = {
            epis: { idField: 'epi', data: epis, watchField: 'epis', idsField: 'episIds' },
            equipamentos: { idField: 'equipamento', data: equipamentos, watchField: 'equipamentos', idsField: 'equipmentIds' },
            produtos: { idField: 'produto', data: produtos, watchField: 'produtos', idsField: 'productIds' },
            transportes: { idField: 'transporte', data: transportes, watchField: 'transportes', idsField: 'vehicleIds' }
        };

        const { idField, data, watchField, idsField } = fieldMap[type];
        const selectedIds = selectedItems[idField as keyof typeof selectedItems];

        if (selectedIds.length === 0) return;

        const currentItems = watch(watchField) || [];
        const itemsToAdd = data.filter((item: any) =>
            selectedIds.includes(item.id) &&
            !currentItems.some((existing: any) => existing.id === item.id)
        );

        if (itemsToAdd.length > 0) {
            const updatedItems = [...currentItems, ...itemsToAdd];
            setValue(watchField, updatedItems);
            setValue(idsField, updatedItems.map((item: any) => item.id));
            setSelectedItems(prev => ({ ...prev, [idField]: [] }));
        }
    };

    const handleRemoveItem = (itemId: number, type: 'epis' | 'equipamentos' | 'produtos' | 'transportes') => {
        const fieldMap = {
            epis: { watchField: 'epis', idsField: 'episIds' },
            equipamentos: { watchField: 'equipamentos', idsField: 'equipmentIds' },
            produtos: { watchField: 'produtos', idsField: 'productIds' },
            transportes: { watchField: 'transportes', idsField: 'vehicleIds' }
        };

        const { watchField, idsField } = fieldMap[type];
        const currentItems = watch(watchField) || [];
        const updatedItems = currentItems.filter((item: any) => item.id !== itemId);

        setValue(watchField, updatedItems);
        setValue(idsField, updatedItems.map((item: any) => item.id));
    };

    const handleRemoveSelected = (value: number, field: keyof typeof selectedItems) => {
        setSelectedItems(prev => ({
            ...prev,
            [field]: prev[field].filter(id => id !== value)
        }));
    };

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

    const columns = (type: 'epis' | 'equipamentos' | 'produtos' | 'transportes'): GridColDef<any>[] => [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        aria-label="remover"
                        size="small"
                        onClick={() => handleRemoveItem(params.row.id, type)}
                    >
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'id',
            headerName: '#ID',
            width: 120
        },
        {
            field: 'name',
            headerName: 'Descrição',
            width: 320,
        },
    ];

    const renderSection = (
        type: 'epis' | 'equipamentos' | 'produtos' | 'transportes',
        label: string,
        data: any[],
        errorField: string
    ) => {
        const fieldMap = {
            epis: { idField: 'epi', watchField: 'epis' },
            equipamentos: { idField: 'equipamento', watchField: 'equipamentos' },
            produtos: { idField: 'produto', watchField: 'produtos' },
            transportes: { idField: 'transporte', watchField: 'transportes' }
        };

        const { idField, watchField } = fieldMap[type];
        const error = errors?.[errorField]?.message;

        return (
            <Box className="w-[100%] flex flex-col gap-5">
                <Box
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleSection(type)}
                >
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">{label}</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                    {expandedSections[type] ? <FiChevronUp color="#3aba8a" /> : <FiChevronDown color="#3aba8a" />}
                </Box>
                <Collapse in={expandedSections[type]}>
                    <Box className="h-[600px] flex flex-col gap-5">
                        <Box className="flex flex-col gap-3">
                            <FormControl sx={formTheme} fullWidth error={!!error}>
                                <InputLabel>{label}</InputLabel>
                                <Select
                                    multiple
                                    label={label}
                                    value={selectedItems[idField as keyof typeof selectedItems]}
                                    onChange={(e) => setSelectedItems(prev => ({
                                        ...prev,
                                        [idField]: e.target.value as number[]
                                    }))}
                                    renderValue={(selected) => renderChips(
                                        selected as number[],
                                        idField,
                                        (value) => handleRemoveSelected(value, idField as keyof typeof selectedItems),
                                        data
                                    )}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                            },
                                        },
                                    }}
                                >
                                    {Array?.isArray(data) && data.map((item) => (
                                        <MenuItem key={item?.id} value={item?.id}>
                                            {item?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{error}</FormHelperText>
                            </FormControl>
                            <Button sx={[buttonTheme, { alignSelf: 'flex-end', width: 'fit-content' }]} onClick={() => handleAddItems(type)}>
                                <FiPlus size={20} color="#fff" />
                                Adicionar
                            </Button>
                        </Box>
                        <DataGrid
                            rows={watch(watchField) || []}
                            columns={columns(type)}
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
                            sx={tableTheme}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Collapse>
            </Box>
        );
    };

    return (
        <Box className="w-[100%] flex flex-col gap-5">
            {renderSection('epis', 'EPIs', epis, 'episIds')}
            {renderSection('equipamentos', 'Equipamentos', equipamentos, 'equipmentIds')}
            {renderSection('produtos', 'Produtos', produtos, 'productIds')}
            {renderSection('transportes', 'Transportes', transportes, 'vehicleIds')}
        </Box>
    );
}