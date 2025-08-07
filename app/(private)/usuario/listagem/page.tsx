"use client";

import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';
import { FiPlus } from 'react-icons/fi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { GoDownload } from 'react-icons/go';
import { formTheme } from '@/app/styles/formTheme/theme';
import DetailModal from './component/modalPessoaDetail';
import { useGetIDStore } from '@/app/store/getIDStore';
import { useRouter } from 'next/navigation';
import { useGetUsuario } from '@/app/hooks/usuarios/get';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { LoadingComponent } from '@/app/components/loading';

export default function ListagemPessoa() {

    const router = useRouter();
    const { setId } = useGetIDStore()
    const { data: position } = useGet({ url: "position" });
    const [isFilter, setIsFilter] = useState(false);
    const { data: pessoasLista } = useGet({ url: 'person' });
    const [modalDetail, setModalDetail] = useState(false);
    const [detail, setDetail] = useState<any | null>(null);
    const [search, setSearch] = useState<any>({ query: '', position: null, supervisorId: null, managerId: null });
    const { data: pessoas } = useGetUsuario({ query: search.query, supervisorId: search.supervisorId, position: search.position, managerId: search.managerId });

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/usuario/atualizar`);
        }, 500)
    }

    const userTypes: any = {
        DEFAULT: '',
        DIKMA_ADMINISTRATOR: 'Administrador Dikma',
        CONTRACT_MANAGER: 'Gestão',
        CLIENT_ADMINISTRATOR: 'Administrador(a) Cliente Dikma',
        DIKMA_DIRECTOR: 'Diretoria Dikma',
        OPERATIONAL: 'Operacional'
    }

    const columns: GridColDef<User>[] = [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton aria-label="visualizar" size="small" onClick={() => handleChangeModalDetail(params.row)}>
                        <MdOutlineVisibility color='#635D77' />
                    </IconButton>
                    <IconButton aria-label="editar" size="small" onClick={() => handleChangeModalEdit(params.row.id)} >
                        <MdOutlineModeEditOutline color='#635D77' />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'id',
            headerName: '#ID',
            width: 80
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                const status = params.value.toLowerCase() === 'active' ? 'Ativo' : 'Inativo';
                const color = params.value.toLowerCase() === 'active' ? 'success' : 'error';
                return (
                    <Chip
                        label={status}
                        color={color}
                        size="small"
                        variant="outlined"
                    />
                );
            },
        },
        {
            field: 'name',
            headerName: 'Nome',
            width: 180,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'userType',
            headerName: 'Usuário',
            width: 180,
            renderCell: (params) => userTypes[params.value] || params.value,
        },
        {
            field: 'position',
            headerName: 'Cargo',
            width: 180,
        },
        {
            field: 'supervisor',
            headerName: 'Encarregado Responsável',
            width: 200,
        },
        {
            field: 'manager',
            headerName: 'Gerente Responsável',
            width: 200,
        }
    ];

    return (
        <StyledMainContainer>

            <DetailModal handleChangeModalDetail={() => handleChangeModalDetail(null)} modalDetail={detail} />

            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoas</h1>
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                        <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Listagem</h1>
                    </Box>
                    <Box className="flex  items-center self-end gap-3">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setIsFilter(!isFilter)}>
                            {isFilter ? <MdOutlineFilterAltOff size={25} color='#635D77' /> : <MdOutlineFilterAlt size={25} color='#635D77' />}
                        </Button>
                        <Button variant="outlined" sx={buttonThemeNoBackground}>
                            <GoDownload size={25} color='#635D77' />
                        </Button>
                        <Button href="/usuario/cadastro" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Usuário
                        </Button>
                    </Box>
                </Box>

                {
                    isFilter && (
                        <Box>
                            <Box className="flex gap-3 justify-between items-center">
                                <TextField
                                    value={search.query}
                                    onChange={(e) => setSearch({ ...search, query: e.target.value })} variant="outlined" label="Nome, Email ou Usuário" className="w-[100%]" sx={formTheme} />
                                <FormControl fullWidth sx={formTheme}>
                                    <InputLabel id="cargo-label">Cargo</InputLabel>
                                    <Select
                                        value={search.position || ""}
                                        labelId="cargo-label"
                                        label="Pessoa"
                                        onChange={(e) => setSearch({ ...search, position: Number(e.target.value) })}
                                    >
                                        {position?.map((cargo: any) => (
                                            <MenuItem key={cargo.id} value={cargo.id}>
                                                <Box display="flex" justifyContent="space-between" width="100%">
                                                    <Box className="flex flex-col">
                                                        <span className="text-[#000] text-[1rem]">{cargo?.name}</span>
                                                        <span className="text-gray-600 text-[.8rem]">{cargo?.tradeName}</span>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={formTheme}>
                                    <InputLabel>Encarregado Responsável</InputLabel>
                                    <Select
                                        value={search.supervisorId || ""}
                                        label="Encarregado Responsável"
                                        onChange={(e) => setSearch({ ...search, supervisorId: Number(e.target.value) })}
                                    >
                                        <MenuItem value="" disabled>Selecione um supervisorId...</MenuItem>
                                        {Array.isArray(pessoasLista) && pessoasLista.map((pessoa) => (
                                            <MenuItem key={pessoa.id} value={pessoa.id}>
                                                {pessoa.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={formTheme}>
                                    <InputLabel>Gestor Responsável</InputLabel>
                                    <Select
                                        value={search.managerId || ""}
                                        label="Gestor Responsável"
                                        onChange={(e) => setSearch({ ...search, managerId: Number(e.target.value) })}
                                        sx={formTheme}
                                    >
                                        <MenuItem value="" disabled>Selecione um supervisorId...</MenuItem>
                                        {Array.isArray(pessoasLista) && pessoasLista.map((pessoa) => (
                                            <MenuItem key={pessoa.id} value={pessoa.id}>
                                                {pessoa.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box className="flex gap-2 items-center justify-end mt-2">
                                <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setSearch({ query: "", position: null, supervisorId: null })}>
                                    Limpar
                                </Button>
                            </Box>
                        </Box>
                    )
                }

                {pessoas ?
                    (<DataGrid
                        rows={pessoas}
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
                    />) :
                    (<LoadingComponent />)
                }
            </Box>
        </StyledMainContainer >
    );
}