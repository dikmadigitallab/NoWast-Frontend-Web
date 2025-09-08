"use client";

import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { StyledMainContainer } from '@/app/styles/container/container';
import { Button, IconButton, Pagination, PaginationItem, TextField, Typography } from '@mui/material';
import { LoadingComponent } from '@/app/components/loading';
import { formTheme } from '@/app/styles/formTheme/theme';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetIDStore } from '@/app/store/getIDStore';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { GoDownload } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import DetailModal from './component/modalDetail';

export default function ListagemPredios() {

    const router = useRouter();
    const { setId } = useGetIDStore();
    const [isFilter, setIsFilter] = useState(false);
    const [modalDetail, setModalDetail] = useState(false);
    const [detail, setDetail] = useState<any | null>(null);
    const [search, setSearch] = useState<any>({ query: '' });
    const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 25 });
    const { data: predios, pages } = useGet({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize, url: "building", query: search.query });

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/locais/predio/atualizar`);
        }, 500)
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({
            ...prev,
            pageNumber: page
        }));
    }

    const columns: GridColDef<any>[] = [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton aria-label="visualizar" size="small" onClick={() => handleChangeModalDetail(params.row)} >
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
            headerName: 'Nome do Prédio',
            width: 180,
        },
        {
            field: 'radius',
            headerName: 'Raio',
            width: 180,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {params.row.radius} m
                </Box>
            ),
        },
        {
            field: 'raio',
            headerName: 'Latitude / Longitude',
            width: 240,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Lat: {params.row.latitude}, Long: {params.row.longitude}
                </Box>
            ),
        },
        {
            field: 'description',
            headerName: 'Descrição',
            width: 300,
        }
    ];

    return (
        <StyledMainContainer>
            <DetailModal handleChangeModalDetail={() => handleChangeModalDetail(null)} modalDetail={detail} />
            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédios</h1>
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
                        <Button href="/locais/predio/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Prédio
                        </Button>
                    </Box>
                </Box>

                {
                    isFilter && (
                        <Box>
                            <Box className="flex gap-3 justify-between items-center">
                                <TextField value={search.query} onChange={(e) => setSearch({ ...search, query: e.target.value })} variant="outlined" label="Nome do prédio" className="w-[100%]" sx={formTheme} />
                            </Box>
                            <Box className="flex gap-2 items-center justify-end mt-2">
                                <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setSearch({ query: '' })}>
                                    Limpar
                                </Button>
                            </Box>
                        </Box>
                    )
                }

                {predios ?
                    (<>
                        <DataGrid
                            rows={predios || []}
                            columns={columns}
                            disableRowSelectionOnClick
                            hideFooterPagination
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

                        <Box className="h-10 flex justify-center items-center  mt-4">
                            <Pagination
                                hidden={pages?.totalPages <= 1}
                                count={pages?.totalPages || 1}
                                page={pagination.pageNumber}
                                onChange={handlePageChange}
                                color="primary"
                                renderItem={(item) => (
                                    <PaginationItem
                                        {...item}
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: '#00b288',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#00755a',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </>) :
                    (<LoadingComponent />)
                }
            </Box>
        </StyledMainContainer>
    );
}