"use client";

import { useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, CircularProgress, Chip } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { IoMdClose } from 'react-icons/io';

import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { formTheme } from "@/app/styles/formTheme/theme";
import { tableTheme } from "@/app/styles/tableTheme/theme";
import { useGetIDStore } from '@/app/store/getIDStore';
import { useGet } from '@/app/hooks/crud/get/useGet';

type Service = { id: number, name: string };

export default function FormCheckList({ control, setValue, watch, formState: { errors } }: { control: any, setValue: any, watch: any, formState: { errors: any } }) {

    const { id } = useGetIDStore();
    const { data: services, loading } = useGet({ url: "service", environmentId: id });
    const [selectedState, setSelectedState] = useState<{ services: string[] }>({ services: [] });

    const handleRemoveSelected = (value: string, field: keyof typeof selectedState, setSelectedState: any) => {
        setSelectedState((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((id: string) => id !== value)
        }));
    };

    const renderChips = (
        selected: string[],
        field: keyof typeof selectedState,
        setSelectedState: any,
        items: Service[] = []
    ) => {
        const safeItems = Array.isArray(items) ? items : [];
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                    const selectedItem = safeItems.find(item => item.id.toString() === value);
                    return (
                        <Chip
                            key={value}
                            label={selectedItem ? selectedItem.name : `ID: ${value}`}
                            onDelete={() => handleRemoveSelected(value, field, setSelectedState)}
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

        const currentServices = watch("serviceItems") || [];
        const serviceToAdd = (services || []).filter((service: any) =>
            selectedState.services.includes(service.id.toString()) &&
            !currentServices.some((existingService: any) => existingService.id.toString() === service.id.toString())
        );

        if (serviceToAdd.length > 0) {
            const updatedServices = [...currentServices, ...serviceToAdd];
            setValue("serviceItems", updatedServices);
            setValue("serviceItemsIds", updatedServices.map((service: any) => service.id));
            setSelectedState((prev) => ({ ...prev, services: [] }));
        }
    };

    const handleRemoveService = (serviceId: string) => {
        const currentServices = watch("serviceItems") || [];
        const updatedServices = currentServices.filter((service: any) => service.id.toString() !== serviceId);

        setValue("serviceItems", updatedServices);
        setValue("serviceItemsIds", updatedServices.map((service: any) => service.id));
    };

    const columns: GridColDef<any>[] = [
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
                        onClick={() => handleRemoveService(params.row.id.toString())}
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
        }
    ];

    return (
        <Box className="w-[100%] flex flex-col gap-5">
            <Box className="w-[100%] flex flex-col gap-5">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a]" />
                    <span className="text-[#3aba8a] font-bold">Checklist</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a]" />
                </Box>
                <Box className="flex flex-col gap-3">
                    <Box className="flex flex-row gap-3 h-[60px]">
                        <FormControl sx={formTheme} fullWidth>
                            <InputLabel>Checklist</InputLabel>
                            <Select
                                label="Checklist"
                                multiple
                                value={selectedState.services}
                                onChange={(e) =>
                                    setSelectedState((prev) => ({
                                        ...prev,
                                        services: e.target.value as string[]
                                    }))
                                }
                                renderValue={() =>
                                    renderChips(selectedState.services, "services", setSelectedState, services)
                                }
                            >
                                <MenuItem value="" disabled>Selecione serviços...</MenuItem>
                                {(services || []).map((service: any) => (
                                    <MenuItem key={service?.id} value={service?.id.toString()}>
                                        {service?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {loading && (
                                <CircularProgress
                                    className='absolute right-2 top-5 bg-white'
                                    color="inherit"
                                    size={20}
                                />
                            )}
                        </FormControl>
                        <Button
                            sx={[buttonTheme, { height: "90%" }]}
                            onClick={handleAddServices}
                        >
                            <FiPlus size={25} color="#fff" />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DataGrid
                rows={watch("serviceItems") || []}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={tableTheme}
                getRowId={(row) => row.id}
                hideFooter
            />
        </Box>
    );
}
