import { useState } from 'react';
import { Box, Button, IconButton, Collapse, Chip, CircularProgress, Typography } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { tableTheme } from '@/app/styles/tableTheme/theme';
import { IoMdClose } from 'react-icons/io';
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { useDebounce } from "@/app/utils/useDebounce";

export default function FormItens({ control, setValue, watch, formState: { errors } }: { control?: any, setValue?: any, watch?: any, formState: { errors?: any } }) {

    const [searchQueryEpi, setSearchQueryEpi] = useState('');
    const [searchQueryEquipamento, setSearchQueryEquipamento] = useState('');
    const [searchQueryProduto, setSearchQueryProduto] = useState('');
    const [searchQueryTransporte, setSearchQueryTransporte] = useState('');
    
    const debouncedSearchQueryEpi = useDebounce(searchQueryEpi, 500);
    const debouncedSearchQueryEquipamento = useDebounce(searchQueryEquipamento, 500);
    const debouncedSearchQueryProduto = useDebounce(searchQueryProduto, 500);
    const debouncedSearchQueryTransporte = useDebounce(searchQueryTransporte, 500);

    const { data: epis, loading: loadingEpi } = useGet({ url: "ppe", query: debouncedSearchQueryEpi });
    const { data: equipamentos, loading: loadingEquipamento } = useGet({ url: "tools", query: debouncedSearchQueryEquipamento });
    const { data: produtos, loading: loadingProduto } = useGet({ url: "product", query: debouncedSearchQueryProduto });
    const { data: transportes, loading: loadingTransporte } = useGet({ url: "transport", query: debouncedSearchQueryTransporte });

    const [selectedItems, setSelectedItems] = useState({
        epi: [] as any[],
        equipamento: [] as any[],
        produto: [] as any[],
        transporte: [] as any[]
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
            epis: { idField: 'epi', watchField: 'epis', idsField: 'epiIds' },
            equipamentos: { idField: 'equipamento', watchField: 'equipamentos', idsField: 'equipmentIds' },
            produtos: { idField: 'produto', watchField: 'produtos', idsField: 'productIds' },
            transportes: { idField: 'transporte', watchField: 'transportes', idsField: 'vehicleIds' }
        };

        const { idField, watchField, idsField } = fieldMap[type];
        const selectedItemsArray = selectedItems[idField as keyof typeof selectedItems];

        if (selectedItemsArray.length === 0) return;

        const currentItems = watch(watchField) || [];
        const itemsToAdd = selectedItemsArray.filter((item: any) =>
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

    const renderSection = (type: 'epis' | 'equipamentos' | 'produtos' | 'transportes', label: string, data: any[], errorField: string, searchQuery: string, setSearchQuery: (query: string) => void, loading: boolean) => {
        const fieldMap = { epis: { idField: 'epi', watchField: 'epis' }, equipamentos: { idField: 'equipamento', watchField: 'equipamentos' }, produtos: { idField: 'produto', watchField: 'produtos' }, transportes: { idField: 'transporte', watchField: 'transportes' } };
        const { idField, watchField } = fieldMap[type];
        const error = errors?.[errorField]?.message;

        return (
            <Box className="w-[100%] flex flex-col gap-5">
                <Box className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection(type)}>
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">{label}</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                    {expandedSections[type] ? <FiChevronUp color="#3aba8a" /> : <FiChevronDown color="#3aba8a" />}
                </Box>
                <Collapse in={expandedSections[type]}>
                    <Box className="h-[500px] flex flex-col gap-5">
                        <Box className="flex flex-row justify-center items-center gap-3 ">
                            <CustomAutocomplete
                                multiple
                                options={data || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                multipleValue={selectedItems[idField as keyof typeof selectedItems]}
                                loading={loading}
                                onInputChange={(newInputValue) => {
                                    setSearchQuery(newInputValue);
                                }}
                                onMultipleChange={(newValue) => {
                                    setSelectedItems(prev => ({
                                        ...prev,
                                        [idField]: newValue
                                    }));
                                }}
                                label={label}
                                error={!!error}
                                helperText={error}
                                noOptionsText={`Nenhum ${label.toLowerCase()} encontrado`}
                                loadingText={`Carregando ${label.toLowerCase()}...`}
                                className="w-full"
                            />
                            <Button sx={[buttonTheme, { width: 'fit-content', height: 55 }]} onClick={() => handleAddItems(type)}>
                                <FiPlus size={20} color="#fff" />
                            </Button>
                        </Box>
                        <DataGrid
                            rows={watch(watchField) || []}
                            columns={columns(type)}
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                            pageSizeOptions={[5, 25, 100]}
                            disableRowSelectionOnClick
                            sx={tableTheme}
                            getRowId={(row) => row.id}
                            hideFooter
                            slots={{
                                noRowsOverlay: () => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            color: '#666',
                                        }}
                                    >
                                        <Typography variant="h6">Nenhum dado encontrado</Typography>
                                        <Typography variant="body2">Tente ajustar os filtros ou adicionar novos registros.</Typography>
                                    </Box>

                                )
                            }}
                        />
                    </Box>
                </Collapse>
            </Box>
        );
    };

    return (
        <Box className="w-[100%]  flex flex-col gap-5">
            {renderSection('epis', 'EPIs', epis, 'epiIds', searchQueryEpi, setSearchQueryEpi, loadingEpi)}
            {renderSection('equipamentos', 'Equipamentos', equipamentos, 'equipmentIds', searchQueryEquipamento, setSearchQueryEquipamento, loadingEquipamento)}
            {renderSection('produtos', 'Produtos', produtos, 'productIds', searchQueryProduto, setSearchQueryProduto, loadingProduto)}
            {renderSection('transportes', 'Transportes', transportes, 'vehicleIds', searchQueryTransporte, setSearchQueryTransporte, loadingTransporte)}
        </Box>
    );
}