import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, FormHelperText, CircularProgress, Chip, Typography, Autocomplete, TextField } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { formTheme } from "@/app/styles/formTheme/theme";
import { tableTheme } from '@/app/styles/tableTheme/theme';
import { IoMdClose } from 'react-icons/io';
import { useGetUsuario } from '@/app/hooks/usuarios/get';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { useDebounce } from "@/app/utils/useDebounce";

export default function FormPessoas({ control, setValue, watch, formState: { errors } }: { control: any, setValue: any, watch: any, formState: { errors: any, } }) {

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    
    const { data: pessoasRaw, loading } = useGetUsuario({ 
        query: debouncedSearchQuery,
        pageSize: 25,
        pageNumber: 1
    });
    const { data: cargos } = useGet({ url: 'position', disablePagination: true });
    
    // Remove duplicatas baseadas no ID
    const pessoas = pessoasRaw ? pessoasRaw.filter((pessoa: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === pessoa.id)
    ) : [];
    
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    // Função para buscar o nome do cargo pelo ID
    const getCargoName = (positionId: number) => {
        const cargo = cargos?.find((c: any) => c.id === positionId);
        return cargo?.name || '';
    };
    const handleAddUsers = () => {
        if (selectedUsers.length === 0) return;

        const currentUsers = watch("users") || [];
        const usersToAdd = pessoas.filter((user: any) =>
            selectedUsers.includes(user.id.toString()) &&
            !currentUsers.some((existingUser: any) => existingUser.userId.toString() === user.id.toString())
        );

        if (usersToAdd.length > 0) {
            const updatedUsers = [...currentUsers, ...usersToAdd];
            setValue("users", updatedUsers);
            setValue("usersIds", updatedUsers.map((user: any) => user.userId));
            setSelectedUsers([]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        const currentUsers = watch("users") || [];
        const updatedUsers = currentUsers.filter((user: any) => user.userId.toString() !== userId);

        setValue("users", updatedUsers);
        setValue("usersIds", updatedUsers.map((user: any) => user.userId));
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
                    <IconButton aria-label="remover" size="small" onClick={() => handleRemoveUser(params.row.userId.toString())}>
                        <GoTrash color='#635D77' size={20} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'userId',
            headerName: '#ID',
            width: 120
        },
        {
            field: 'name',
            headerName: 'Nome',
            width: 320,
            renderCell: (params: any) => params.row.user?.person?.name || ''
        },
        {
            field: 'position',
            headerName: 'Cargo',
            width: 220,
            renderCell: (params: any) => {
                const positionId = params.row.user?.positionId;
                return positionId ? getCargoName(positionId) : '';
            }
        },

        
    ];

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
                            <FormControl sx={formTheme} fullWidth error={!!errors.supervisorId}>
                                <InputLabel>Encarregado</InputLabel>
                                <Select
                                    disabled={loading}
                                    label="Encarregado"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(pessoas) && pessoas.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {loading && (<CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />)}
                                <FormHelperText>{errors.supervisorId?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                            <FormControl sx={formTheme} fullWidth error={!!errors?.managerId}>
                                <InputLabel>Líder/Gestor</InputLabel>
                                <Select
                                    disabled={loading}
                                    label="Líder/Gestor"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(pessoas) && pessoas.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {loading && (<CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />)}
                                <FormHelperText>{errors?.managerId?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>
            </Box>

            <Box className="w-[100%] flex flex-col gap-5 ">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Pessoas</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                </Box>
                <Box className="flex flex-col gap-3">
                    <Box className="flex flex-row gap-3 h-[60px]">
                        <Autocomplete
                            multiple
                            fullWidth
                            options={pessoas || []}
                            getOptionLabel={(option: any) => option.name || ''}
                            getOptionKey={(option: any) => option.id}
                            value={pessoas?.filter((pessoa: any) => selectedUsers.includes(pessoa.id.toString())) || []}
                            loading={loading}
                            onInputChange={(event, newInputValue) => {
                                setSearchQuery(newInputValue);
                            }}
                            onChange={(event, newValue) => {
                                const selectedIds = newValue.map((pessoa: any) => pessoa.id.toString());
                                setSelectedUsers(selectedIds);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pessoas"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                    {option.name}
                                </Box>
                            )}
                            renderValue={(value) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {value.map((option, index) => (
                                        <Chip
                                            key={option.id}
                                            label={option.name}
                                            size="small"
                                            onDelete={() => {
                                                const newValue = value.filter((_, i) => i !== index);
                                                const selectedIds = newValue.map((pessoa: any) => pessoa.id.toString());
                                                setSelectedUsers(selectedIds);
                                            }}
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
                                    ))}
                                </Box>
                            )}
                            noOptionsText="Nenhuma pessoa encontrada"
                            loadingText="Carregando pessoas..."
                        />
                        <Button sx={[buttonTheme, { height: 55 }]} onClick={handleAddUsers}>
                            <FiPlus size={25} color="#fff" />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DataGrid
                rows={(() => {
                    const usersData = watch("users") || [];
                    console.log('Dados da lista de usuários na tabela:', usersData);
                    return usersData;
                })()}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                pageSizeOptions={[5, 25, 100]}
                disableRowSelectionOnClick
                sx={tableTheme}
                getRowId={(row) => row.userId}
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
    )
}