
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Checkbox, ListItemText, Chip, OutlinedInput, FormHelperText } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus, FiTool } from "react-icons/fi";
import { rows } from "./data";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useGetUsuario } from "@/app/hooks/usuario/get";


export default function FormPessoas({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

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

    const { users } = useGetUsuario();

    return (
        <Box className="w-[100%] flex flex-col gap-5">

            <Box className="w-[100%] flex flex-col gap-5">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Responsáveis</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                </Box>

                <Box className="flex flex-row gap-3 h-[60px]">
                    <Controller
                        name="supervisorId"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.supervisorId}>
                                <InputLabel>Encarregado</InputLabel>
                                <Select
                                    label="Encarregado"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(users) && users.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.person?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.supervisorId?.message}</FormHelperText>
                            </FormControl>
                        )}
                    /> <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors?.managerId}>
                                <InputLabel>Líder/Gestor</InputLabel>
                                <Select
                                    label="Líder/Gestor"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(users) && users.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.person?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors?.managerId?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>
            </Box>

            <Box className="w-[100%] flex flex-col gap-5">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Pessoas</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                </Box>
                <Box className="flex flex-row gap-3 h-[60px]">
                    <Controller
                        name="manager.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth
                            // error={!!errors?.manager?.connect?.id}
                            >
                                <InputLabel>Usuário</InputLabel>
                                <Select
                                    label="Usuário"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(users) && users.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.person?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors?.manager?.connect?.id?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
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