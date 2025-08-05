import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, FormHelperText, CircularProgress } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { formTheme } from "@/app/styles/formTheme/theme";
import { tableTheme } from '@/app/styles/tableTheme/theme';

export default function FormPessoas({ control, setValue, watch, formState: { errors } }: { control: any, setValue: any, watch: any, formState: { errors: any, } }) {

    const { data: users, loading } = useGet({ url: "person" });
    const [selectedUser, setSelectedUser] = useState<string>('');

    const handleAddUser = () => {
        if (!selectedUser) return;

        const currentUsers = watch("users") || [];
        const userToAdd = users.find((user: any) => user.id.toString() === selectedUser);

        if (userToAdd && !currentUsers.some((user: any) => user.id.toString() === selectedUser)) {
            const updatedUsers = [...currentUsers, userToAdd];
            setValue("users", updatedUsers);
            setValue("usersIds", updatedUsers.map((user: any) => user.id));
            setSelectedUser('');
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
            headerName: 'Descrição',
            width: 320,
        },
        {
            field: 'phones',
            headerName: 'Telefone',
            width: 220,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {params.value.map((phone: any, index: number) => (
                        <span key={index}>{phone.phoneNumber}</span>
                    ))}
                </Box>
            ),
        }
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
                                    label="Encarregado"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(users) && users.map((pessoa) => (
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
                                    label="Líder/Gestor"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(users) && users.map((pessoa) => (
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

            <Box className="w-[100%] flex flex-col gap-5">
                <Box className="flex items-center gap-2">
                    <Box className="w-[15px] h-[15px] bg-[#3aba8a] " />
                    <span className="text-[#3aba8a] font-bold">Pessoas</span>
                    <Box className="flex-1 h-[1px] bg-[#3aba8a] " />
                </Box>
                <Box className="flex flex-row gap-3 h-[60px]">
                    <FormControl sx={formTheme} fullWidth error={!!errors?.usersIds}>
                        <InputLabel>Pessoa</InputLabel>
                        <Select label="Pessoa" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                            <MenuItem value="" disabled>Selecione um usuário...</MenuItem>
                            {Array?.isArray(users) && users.map((pessoa) => (
                                <MenuItem key={pessoa?.id} value={pessoa?.id.toString()}>
                                    {pessoa?.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors?.usersIds?.message}</FormHelperText>
                        {loading && (<CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />)}
                    </FormControl>
                    <Button
                        sx={[buttonTheme, { height: "90%" }]}
                        onClick={handleAddUser}
                    >
                        <FiPlus size={25} color="#fff" />
                    </Button>
                </Box>
            </Box>

            <Box>
                <DataGrid
                    rows={watch("users") || []}
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
                    sx={tableTheme}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    )
}