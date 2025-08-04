"use client";

import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { StyledMainContainer } from '@/app/styles/container/container';
import { LoadingComponent } from '@/app/components/loading';
import { formTheme } from '@/app/styles/formTheme/theme';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetIDStore } from '@/app/store/getIDStore';
import DetailModal from './component/modalEPIDetail';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { ptBR } from '@mui/x-data-grid/locales';
import { useRouter } from 'next/navigation';
import { GoDownload } from 'react-icons/go';
import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Box from '@mui/material/Box';

export default function ListagemEpi() {

    const router = useRouter();
    const { setId } = useGetIDStore();
    const [isFilter, setIsFilter] = useState(false);
    const { data: pessoas } = useGet({ url: 'person' });
    const [modalDetail, setModalDetail] = useState(false);
    const { data: predios } = useGet({ url: 'building' });
    const [detail, setDetail] = useState<any | null>(null);
    const [search, setSearch] = useState<any>({ query: '', responsibleManagerId: null, buildingId: null });
    const { data: epis } = useGet({ url: 'ppe', query: search.query, responsibleManagerId: search.responsibleManagerId, buildingId: search.buildingId });

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/items/epi/atualizar`);
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
            <DetailModal handleChangeModalDetail={() => handleChangeModalDetail(null)} modalDetail={detail} />
            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">EPIs</h1>
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
                        <Button href="/items/epi/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar EPI
                        </Button>
                    </Box>
                </Box>
                {
                    isFilter && (
                        <Box>
                            <Box className="flex gap-3 justify-between items-center">
                                <TextField
                                    value={search.query}
                                    onChange={(e) => setSearch({ ...search, query: e.target.value })} variant="outlined" label="Nome do EPI" className="w-[100%]" sx={formTheme} />
                                <FormControl fullWidth sx={formTheme}>
                                    <InputLabel>Encarregado Responsável</InputLabel>
                                    <Select
                                        value={search.responsibleManagerId || ""}
                                        label="Encarregado Responsável"
                                        onChange={(e) => setSearch({ ...search, responsibleManagerId: Number(e.target.value) })}
                                    >
                                        <MenuItem value="" disabled>Selecione um supervisor...</MenuItem>
                                        {Array.isArray(pessoas) && pessoas?.map((pessoa) => (
                                            <MenuItem key={pessoa.id} value={pessoa.id}>
                                                {pessoa.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={formTheme}>
                                    <InputLabel>Local</InputLabel>
                                    <Select
                                        value={search.buildingId || ""}
                                        label="Local"
                                        onChange={(e) => setSearch({ ...search, buildingId: Number(e.target.value) })}
                                    >
                                        <MenuItem value="" disabled>Selecione um supervisor...</MenuItem>
                                        {Array.isArray(predios) && predios?.map((predio) => (
                                            <MenuItem key={predio.id} value={predio.id}>
                                                {predio.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box className="flex gap-2 items-center justify-end mt-2">
                                <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setSearch({ query: '', responsibleManagerId: null, buildingId: null })}>
                                    Limpar
                                </Button>
                            </Box>
                        </Box>
                    )
                }
                {epis ?
                    (<DataGrid
                        rows={epis}
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
        </StyledMainContainer>
    );
}