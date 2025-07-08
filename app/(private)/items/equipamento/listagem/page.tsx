"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { MdOutlineFilterAlt, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { FiPlus, FiUser } from 'react-icons/fi';
import { Button, IconButton, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { rows } from './data';
import DetailModal from './component/modalEquipamentoDetail';
import EditModal from './component/modalEquipamentoEdit';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import { GoDownload } from 'react-icons/go';
import { formTheme } from '@/app/styles/formTheme/theme';

export default function ListagemEquipamentos() {

    const [edit, setEdit] = useState<any | null>(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [detail, setDetail] = useState<any | null>(null);
    const [modalDetail, setModalDetail] = useState(false);

    const handleChangeModalEdit = (data: any) => {
        setEdit(data);
        setModalEdit(!modalEdit);
    }

    const handleChangeModalDetail = (data: any) => {
        setDetail(data);
        setModalDetail(!modalDetail);
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
                    <IconButton aria-label="editar" size="small" onClick={() => handleChangeModalEdit(params.row)}>
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
            field: 'nome',
            headerName: 'Nome',
            width: 180,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiUser /> {params.value}
                </Box>
            ),
        },
        {
            field: 'encarregado_responsavel',
            headerName: 'Encarregado Responsável',
            width: 200,
        },
        {
            field: 'local',
            headerName: 'Local',
            width: 150,
        },
        {
            field: 'descricao',
            headerName: 'Descrição',
            width: 300,
        }
    ];

    return (
        <StyledMainContainer>

            <DetailModal
                handleChangeModalDetail={() => handleChangeModalDetail(null)}
                modalDetail={detail}
            />
            <EditModal
                edit={edit}
                modalEdit={modalEdit}
                handleChangeModalEdit={() => setModalEdit(!modalEdit)}
            />

            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Equipamento</h1>
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                        <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Listagem</h1>
                    </Box>
                    <Box className="flex  items-center self-end gap-3">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => setIsFilter(!isFilter)}>
                            <MdOutlineFilterAlt size={25} color='#635D77' />
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
                    rows={rows}
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
                    checkboxSelection
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