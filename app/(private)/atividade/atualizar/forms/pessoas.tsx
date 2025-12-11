import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, FormHelperText, CircularProgress, Chip, Typography, TextField } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
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
    const [searchQueryManager, setSearchQueryManager] = useState('');
    const [searchQuerySupervisor, setSearchQuerySupervisor] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const debouncedSearchQueryManager = useDebounce(searchQueryManager, 500);
    const debouncedSearchQuerySupervisor = useDebounce(searchQuerySupervisor, 500);
    
    const { data: pessoasRaw, loading } = useGetUsuario({ 
        query: debouncedSearchQuery,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: pessoasManager, loading: loadingManager } = useGetUsuario({ 
        query: debouncedSearchQueryManager,
        pageSize: 25,
        pageNumber: 1
    });
    
    const { data: pessoasSupervisor, loading: loadingSupervisor } = useGetUsuario({ 
        query: debouncedSearchQuerySupervisor,
        pageSize: 25,
        pageNumber: 1
    });
    const { data: cargos } = useGet({ url: 'position', disablePagination: true });

    // Remove duplicatas baseadas no ID
    const pessoas = pessoasRaw ? pessoasRaw.filter((pessoa: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === pessoa.id)
    ) : [];
    
    const pessoasManagerFiltered = pessoasManager ? pessoasManager.filter((pessoa: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.id === pessoa.id)
    ) : [];
    
    const pessoasSupervisorFiltered = pessoasSupervisor ? pessoasSupervisor.filter((pessoa: any, index: number, self: any[]) => 
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
            !currentUsers.some((existingUser: any) => existingUser.id.toString() === user.id.toString())
        );

        if (usersToAdd.length > 0) {
            const updatedUsers = [...currentUsers, ...usersToAdd];
            setValue("users", updatedUsers);
            setValue("usersIds", updatedUsers.map((user: any) => user.id));
            setSelectedUsers([]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        const currentUsers = watch("users") || [];
        const updatedUsers = currentUsers.filter((user: any) => user.id.toString() !== userId);

        setValue("users", updatedUsers);
        setValue("usersIds", updatedUsers.map((user: any) => user.id));
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
                    <IconButton aria-label="remover" size="small" onClick={() => handleRemoveUser(params.row.id.toString())}>
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
            headerName: 'Nome',
            width: 320,
        },
        {
            field: 'position',
            headerName: 'Cargo',
            width: 220,
            renderCell: (params: any) => {
                const positionId = params.row.positionId;
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
                            <CustomAutocomplete
                                options={pessoasSupervisorFiltered || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={pessoasSupervisorFiltered?.find((pessoa: any) => pessoa.id === field.value) || null}
                                loading={loadingSupervisor}
                                onInputChange={(newInputValue) => {
                                    setSearchQuerySupervisor(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Encarregado"
                                error={!!errors.supervisorId}
                                helperText={errors.supervisorId?.message}
                                noOptionsText="Nenhum encarregado encontrado"
                                loadingText="Carregando encarregados..."
                                className="w-full"
                            />
                        )}
                    />
                    <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                options={pessoasManagerFiltered || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={pessoasManagerFiltered?.find((pessoa: any) => pessoa.id === field.value) || null}
                                loading={loadingManager}
                                onInputChange={(newInputValue) => {
                                    setSearchQueryManager(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                              
                                label="Líder/Gestor"
                                error={!!errors?.managerId}
                                helperText={errors?.managerId?.message}
                                noOptionsText="Nenhum líder/gestor encontrado"
                                loadingText="Carregando líderes/gestores..."
                                className="w-full"
                            />
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
                        <CustomAutocomplete
                            multiple
                            options={pessoas || []}
                            getOptionLabel={(option: any) => option.name || ''}
                            multipleValue={pessoas?.filter((pessoa: any) => selectedUsers.includes(pessoa.id.toString())) || []}
                            loading={loading}
                            onInputChange={(newInputValue) => {
                                setSearchQuery(newInputValue);
                            }}
                            onMultipleChange={(newValue) => {
                                const selectedIds = newValue.map((pessoa: any) => pessoa.id.toString());
                                setSelectedUsers(selectedIds);
                            }}
                            label="Pessoas"
                            noOptionsText="Nenhuma pessoa encontrada"
                            loadingText="Carregando pessoas..."
                            className="w-full"
                        />
                        <Button sx={[buttonTheme, { height: 55 }]} onClick={handleAddUsers}>
                            <FiPlus size={25} color="#fff" />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DataGrid
                rows={watch("users") || []}
                columns={columns}
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
    )
}