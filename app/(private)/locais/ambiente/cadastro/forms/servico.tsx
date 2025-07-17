
import { Controller } from "react-hook-form";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { FiPlus, FiTool } from "react-icons/fi";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { rows } from "./data";
import { ptBR } from "@mui/x-data-grid/locales";

export default function FormServico({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

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
                    <IconButton aria-label="visualizar" size="small" >
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                    <IconButton aria-label="editar" size="small" >
                        <MdOutlineModeEditOutline color='#635D77' size={20} />
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
            field: 'nome',
            headerName: 'Descrição',
            width: 320,
        },
        {
            field: 'servico',
            headerName: 'Serviço',
            width: 220,
        },
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 220,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiTool /> {params.value}
                </Box>
            ),
        },

    ];


    return (
        <Box className="w-[100%] flex flex-col gap-5">
            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="servico"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Serviço"
                            {...field}
                            error={!!errors.servico}
                            helperText={errors.servico?.message}
                            className="w-[50%] mb-5"
                            sx={formTheme}
                        />

                    )}
                />
                <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Tipo"
                            {...field}
                            error={!!errors.tipo}
                            helperText={errors.tipo?.message}
                            className="w-[50%] mb-5"
                            sx={formTheme}
                        />

                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-col gap-5">

                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Checklist</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                </Box>

                <Box className="flex flex-row gap-2 h-[60px]">
                    <TextField
                        variant="outlined"
                        label="Adicionar Checklist"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Digite o nome do checklist"
                        className="w-[49.8%] mb-5"
                        sx={formTheme}
                    />

                    <Button sx={[buttonTheme, { height: "90%" }]}>
                        <FiPlus size={25} color="#fff" />
                    </Button>
                </Box>

                <DataGrid
                    rows={rows}
                    columns={columns}
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


        </Box>
    )
} 