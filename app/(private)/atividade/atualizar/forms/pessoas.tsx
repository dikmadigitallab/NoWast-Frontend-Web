import { useState } from 'react';
import { Controller } from "react-hook-form";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, FormHelperText, CircularProgress, Chip } from "@mui/material";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { FiPlus } from "react-icons/fi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { GoTrash } from "react-icons/go";
import { formTheme } from "@/app/styles/formTheme/theme";
import { tableTheme } from '@/app/styles/tableTheme/theme';
import { IoMdClose } from 'react-icons/io';
import { useGetUsuario } from '@/app/hooks/usuarios/get';

export default function FormPessoas({ control, setValue, watch, formState: { errors } }: { control: any, setValue: any, watch: any, formState: { errors: any, } }) {

    const { data: pessoas, loading } = useGetUsuario({})
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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
            headerName: 'Descrição',
            width: 320,
        },
        {
            field: 'phones',
            headerName: 'Telefone',
            width: 220,
            renderCell: (params) => {
                const phones = Array.isArray(params.value) ? params.value : [];
                return (
                    <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {phones.map((phone: any, index: number) => (
                            <span key={index}>{phone.phoneNumber}</span>
                        ))}
                    </Box>
                );
            },
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
                        <FormControl sx={formTheme} fullWidth >
                            <InputLabel>Pessoas</InputLabel>
                            <Select
                                label="Pessoas"
                                multiple
                                value={selectedUsers}
                                onChange={(e) => setSelectedUsers(e.target.value as string[])}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const selectedPessoa = pessoas.find((p: any) => p.id.toString() === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={selectedPessoa?.name || value}
                                                    size="small"
                                                    onDelete={() => setSelectedUsers(selectedUsers.filter(id => id !== value))}
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
                                )}
                            >
                                <MenuItem value="" disabled>Selecione usuários...</MenuItem>
                                {Array?.isArray(pessoas) && pessoas.map((pessoa) => (
                                    <MenuItem key={pessoa?.id} value={pessoa?.id.toString()}>
                                        {pessoa?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {loading && (<CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />)}
                        </FormControl>
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
            />
        </Box>
    )
}