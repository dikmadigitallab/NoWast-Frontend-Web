"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { Button, IconButton, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { GoDownload } from 'react-icons/go';
import { formTheme } from '@/app/styles/formTheme/theme';
import { useGetIDStore } from '@/app/store/getIDStore';
import { useRouter } from 'next/navigation';
import DetailModal from './component/modalProdutoDetail';
import { useGet } from '@/app/hooks/crud/get/useGet';


export default function ListagemProduto() {

    const [isFilter, setIsFilter] = useState(false);
    const [detail, setDetail] = useState<any | null>(null);
    const [modalDetail, setModalDetail] = useState(false);
    const { data: produtos } = useGet({ url: 'product' });
    const { setId } = useGetIDStore()
    const router = useRouter();

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/items/produto/atualizar`);
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
                    <IconButton aria-label="editar" size="small" onClick={() => handleChangeModalEdit(params.row.id)}>
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
            width: 220
        },
        {
            field: 'description',
            headerName: 'Descrição',
            width: 300,
        },
        {
            field: 'responsibleManager',
            headerName: 'Encarregado Responsável',
            width: 200,
            renderCell: (params) => {
                return params.row ? params.row.responsibleManager.name : '';
            }
        },
        {
            field: 'createdAt',
            headerName: 'Criado em',
            width: 150,
        },
        {
            field: 'updatedAt',
            headerName: 'Atualizado em',
            width: 150,
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
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Produto</h1>
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
                        <Button href="/items/produto/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Produto
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
                    rows={produtos}
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
        </StyledMainContainer>
    );
}