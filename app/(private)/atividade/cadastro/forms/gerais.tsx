
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus, FiTool } from "react-icons/fi";
import { rows } from "./data";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEditOutline } from "react-icons/md";

export default function FormDadosGerais({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {


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

    const local = [
        "Almoxarifado",
        "Obra 1 - Centro",
        "Obra 2 - Zona Norte",
        "Oficina",
        "Depósito"
    ];

    const recorrenciaOptions = [
        "Semanal",
        "Mensal",
        "Anual"
    ];


    return (
        <Box className="w-[100%] flex flex-col gap-5">

            <Box className="w-[100%] flex flex-row justify-between  gap-2 ">
                <Box className="w-[50%] flex flex-row gap-2">
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="ID#"
                                {...field}
                                error={!!errors.id}
                                helperText={errors.id?.message}
                                className="w-[20%]"
                                sx={{
                                    ...formTheme,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#00000012",
                                        borderRadius: "10px"
                                    }
                                }}
                            />
                        )}
                    />

                    <FormControl sx={formTheme} className="w-[80%]" error={!!errors.setor}>
                        <InputLabel>Ambiente</InputLabel>
                        <Controller
                            name="ambiente"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Ambiente"
                                    {...field}
                                    error={!!errors.ambiente}
                                    className="w-[100%]"
                                    sx={formTheme}
                                >
                                    {local.map((local) => (
                                        <MenuItem key={local} value={local}>
                                            {local}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.ambiente && (
                            <p className="text-red-500 text-xs mt-1">{errors.ambiente.message}</p>
                        )}
                    </FormControl>
                </Box>

                <Box className="w-[50%] flex flex-row gap-2">

                    <FormControl sx={formTheme} className="w-[50%]" error={!!errors.setor}>
                        <InputLabel>Recorrência</InputLabel>
                        <Controller
                            name="recorrencia"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Recorrência"
                                    {...field}
                                    error={!!errors.recorrencia}
                                    className="w-[100%]"
                                    sx={formTheme}
                                >
                                    {recorrenciaOptions.map((local) => (
                                        <MenuItem key={local} value={local}>
                                            {local}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.recorrencia && (
                            <p className="text-red-500 text-xs mt-1">{errors.recorrencia.message}</p>
                        )}
                    </FormControl>

                    <Controller
                        name="repete_dia"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Repete Todo Dia"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.repete_dia}
                                helperText={errors.repete_dia?.message}
                                className="w-[25%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="horario"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="No horário"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.horario}
                                helperText={errors.horario?.message}
                                className="w-[25%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2  ">
                <Controller
                    name="predio"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Prédio"
                            {...field}
                            error={!!errors.predio}
                            helperText={errors.predio?.message}
                            className="w-[50%]"
                            sx={{
                                ...formTheme,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px"
                                }
                            }}
                        />
                    )}
                />
                <Controller
                    name="setor"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Setor"
                            {...field}
                            error={!!errors.setor}
                            helperText={errors.setor?.message}
                            className="w-[50%]"
                            sx={{
                                ...formTheme,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px"
                                }
                            }}
                        />
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2  ">
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
                            className="w-[50%]"
                            sx={{
                                ...formTheme,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px"
                                }
                            }}
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
                            className="w-[50%]"
                            sx={{
                                ...formTheme,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px"
                                }
                            }}
                        />
                    )}
                />
            </Box>

            <Box className="w-[100%]">
                <Controller
                    name="observacao"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Observações"
                            multiline
                            rows={10}
                            {...field}
                            error={!!errors.observacao}
                            helperText={errors.observacao?.message}
                            className="w-[100%]"
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-col gap-5">

                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Pessoas</span>
                    <Box className="w-[100%] h-[1px] bg-[#3aba8a] " />
                </Box>

                <Box className="flex flex-row gap-3 h-[60px]">
                    <TextField
                        variant="outlined"
                        label="Adicionar pessoas"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Digite o nome do pessoas"
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