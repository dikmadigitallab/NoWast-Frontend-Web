"use client";

import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Button, Chip, IconButton, TextField } from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';
import { FiPlus, FiUser } from 'react-icons/fi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { GoDownload } from 'react-icons/go';
import { formTheme } from '@/app/styles/formTheme/theme';
import { useGetPessoa } from '@/app/hooks/pessoas/pessoa/get';
import DetailModal from './component/modalPessoaDetail';
import { useGetIDStore } from '@/app/store/getIDStore';
import { useRouter } from 'next/navigation';

export default function DetalharPessoa() {

    const [isFilter, setIsFilter] = useState(false);
    const [modalDetail, setModalDetail] = useState(false);
    const { data: pessoas } = useGetPessoa();
    const [detail, setDetail] = useState<any | null>(null);
    const { setId } = useGetIDStore()
    const router = useRouter();

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/pessoa/atualizar`);
        }, 500)
    }

    const columns: GridColDef<any>[] = [
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
            field: 'name',
            headerName: 'Nome',
            width: 180,
        },
        {
            field: 'tradeName',
            headerName: 'Nome Fantasia',
            width: 180,
        },
        {
            field: 'document',
            headerName: 'CPF/CNPJ',
            width: 180,
        },
        {
            field: 'birthDate',
            headerName: 'Data de Nascimento',
            width: 180,
            renderCell: (params) => {
                const date = new Date(params.value)
                return (
                    <Box>
                        {date.toLocaleDateString('pt-BR')}
                    </Box>
                )
            },
        },
        {
            field: 'emails',
            headerName: 'Email',
            width: 280,
            renderCell: (params) => (
                <Box>
                    {params.value[0]?.email || 'Não informado'}
                </Box>
            ),
        },
        {
            field: 'phones',
            headerName: 'Telefone',
            width: 150,
            renderCell: (params) => {
                const phoneNumber = params.value[0]?.phoneNumber;
                return (
                    <Box>
                        {phoneNumber ?
                            `${phoneNumber.substring(0, 2)} ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`
                            : 'Não informado'}
                    </Box>
                );
            },
        }
    ];

    return (
        <StyledMainContainer>


            <DetailModal
                handleChangeModalDetail={() => handleChangeModalDetail(null)}
                modalDetail={detail}
            />

            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoas</h1>
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                        <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Detalhar</h1>
                    </Box>
                    <Box className="flex  items-center self-end gap-3">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setIsFilter(!isFilter)}>
                            {isFilter ? <MdOutlineFilterAltOff size={25} color='#635D77' /> : <MdOutlineFilterAlt size={25} color='#635D77' />}
                        </Button>
                        <Button variant="outlined" sx={buttonThemeNoBackground}>
                            <GoDownload size={25} color='#635D77' />
                        </Button>
                        <Button href="/pessoa/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Pessoa
                        </Button>
                    </Box>
                </Box>
                {
                    isFilter && (
                        <Box>
                            <Box className="flex gap-3 justify-between items-center">
                                <TextField variant="outlined" label="Nome, Email ou Usuário" className="w-[100%]" sx={formTheme} />
                                <TextField variant="outlined" label="Cargo" className="w-[100%]" sx={formTheme} />
                                <TextField variant="outlined" label="Encarregado Responsável" className="w-[100%]" sx={formTheme} />
                                <TextField variant="outlined" label="Gestor Responsável" className="w-[100%]" sx={formTheme} />
                            </Box>
                            <Box className="flex gap-2 items-center justify-end mt-2">
                                <Button href="/pessoas/cadastro" type="submit" variant="outlined" sx={buttonThemeNoBackground} onClick={() => setIsFilter(false)}>
                                    Limpar
                                </Button>
                                <Button href="/pessoas/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                                    Pesquisar
                                </Button>
                            </Box>
                        </Box>
                    )
                }

                <DataGrid
                    rows={pessoas}
                    columns={columns}
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 15,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 15, 35]}
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
        </StyledMainContainer >
    );
}