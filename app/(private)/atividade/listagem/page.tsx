"use client";

import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { StyledMainContainer } from '@/app/styles/container/container';
import ModalVisualizeDetail from './component/modalActivityDetail';
import { Button, IconButton, TextField, Pagination, PaginationItem, Typography } from '@mui/material';
import { useGetActivity } from '@/app/hooks/atividade/get';
import { LoadingComponent } from '@/app/components/loading';
import { formTheme } from '@/app/styles/formTheme/theme';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetIDStore } from '@/app/store/getIDStore';
import { GoDownload } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Box from '@mui/material/Box';

export default function DataGridAtividades() {

    const router = useRouter();
    const { setId } = useGetIDStore()
    const [isFilter, setIsFilter] = useState(false);
    const [visualize, setVisualize] = useState<any>(null);
    const [modalVisualize, setModalVisualize] = useState(false);
    const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 25 });
    const { data: atividades, loading, pages } = useGetActivity({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize });

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/atividade/atualizar`);
        }, 1000)
    }

    const handleChangeModalVisualize = (data: any) => {
        setVisualize(data);
        setModalVisualize(!modalVisualize);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({
            ...prev,
            pageNumber: page
        }));
    }

    const columns: GridColDef[] = [
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <IconButton aria-label="visualizar" size="small" onClick={() => handleChangeModalVisualize(params.row)}>
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
            width: 80,
        },
        {
            field: 'approvalStatus',
            headerName: 'Status de Aprovação',
            width: 180,
            renderCell: (params) => (
                <Box className="w-[fit-content] m-auto px-2 py-1 rounded-full  text-sm">
                    <Box sx={{ color: params.row?.approvalStatus.color, borderWidth: 1, borderColor: params.row?.approvalStatus.color, borderRadius: '100px', padding: '3px 8px' }}>
                        {params.row?.approvalStatus.title}
                    </Box>
                </Box>
            ),
        },
        {
            field: 'activityTypeEnum',
            headerName: 'Recorrência',
            width: 190,
        },
        {
            field: 'environment',
            headerName: 'Ambiente',
            width: 150,
        },
        {
            field: 'dateTime',
            headerName: 'Data e Hora',
            width: 240,
        },
        {
            field: 'supervisor',
            headerName: 'Supervisor',
            width: 150,
        },
        {
            field: 'manager',
            headerName: 'Gerente',
            width: 150,
        },
        {
            field: 'dimension',
            headerName: 'Dimensão',
            width: 150,
            renderCell: (params) => (
                <span>{params.row?.dimension} m²</span>
            ),

        },
    ];

    return (
        <StyledMainContainer>
            <ModalVisualizeDetail modalVisualize={visualize} handleChangeModalVisualize={handleChangeModalVisualize} />

            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividades</h1>
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
                        <Button href="/atividade/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Atividade
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

                {atividades && !loading ?
                    (<>
                        <DataGrid
                            rows={atividades || []}
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
        </StyledMainContainer >
    );
}