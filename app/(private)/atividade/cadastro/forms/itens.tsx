
import { Box, Button, Checkbox, Chip, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus, FiTool } from "react-icons/fi";
import { rows } from "./data";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Controller } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

export default function FormItens({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

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


    const episOptions = ["Capacete", "Óculos", "Luvas", "Botas", "Protetor Auricular"];

    const renderChips = (selected: string[], fieldName: string, onDelete: (value: string) => void) => (
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {selected.map((value) => (
                <Chip
                    key={value}
                    label={value}
                    onDelete={() => onDelete(value)}
                    deleteIcon={<IoMdClose onMouseDown={(event) => event.stopPropagation()} />}
                />
            ))}
        </Box>
    );

    return (
        <Box className="w-full flex flex-col gap-5">
            <Box className="w-full flex flex-col gap-5">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">EPis</span>
                    <Box className="w-[100%] h-[1px] bg-[#3aba8a] " />
                </Box>

                <Box className="flex flex-row items-center gap-3 h-[60px] ">
                    <FormControl sx={formTheme} className="w-[50%]" error={!!errors.epis}>
                        <InputLabel>Epis</InputLabel>
                        <Controller
                            name="epis"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    label="Epis"
                                    input={<OutlinedInput label="Epis" />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderValue={(selected) => renderChips(
                                        selected as string[],
                                        'epi_responsabilidade',
                                        (value) => field.onChange(field.value.filter((item: string) => item !== value))
                                    )}
                                >
                                    {episOptions.map((maq) => (
                                        <MenuItem key={maq} value={maq}>
                                            <Checkbox checked={field.value.includes(maq)} />
                                            <ListItemText primary={maq} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.epis && (
                            <p className="text-red-500 text-xs mt-1">{errors.epis.message}</p>
                        )}
                    </FormControl>

                    <Button sx={[buttonTheme, { height: "90%" }]}>
                        <FiPlus size={25} color="#fff" />
                    </Button>
                </Box>
            </Box>
            <Box>
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