"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { Button, IconButton } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { rows } from './data';
import Link from 'next/link';
import EditModal from './component/modalPredioEdit';
import { buttonTheme } from '@/app/styles/buttonTheme/theme';

export default function ListagemPredios() {

    const [edit, setEdit] = useState<any | null>(null);
    const [modalEdit, setModalEdit] = useState(false);

    const handleChangeModalEdit = (data: any) => {
        setEdit(data);
        setModalEdit(!modalEdit);
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
                <IconButton aria-label="editar" size="small" onClick={() => handleChangeModalEdit(params.row)}>
                    <MdOutlineModeEditOutline color='#635D77' />
                </IconButton>
            ),
        },
        {
            field: 'id',
            headerName: '#ID',
            width: 80
        },
        {
            field: 'nome',
            headerName: 'Nome do Prédio',
            width: 180,
        },
        {
            field: 'raio',
            headerName: 'Raio',
            width: 240,
            renderCell: (params) => (
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Lat: {params.row.latitude}, Long: {params.row.longitude}
                </Box>
            ),
        },
        {
            field: 'descricao',
            headerName: 'Descrição',
            width: 300,
        }
    ];

    return (
        <>
            <StyledMainContainer>
                <Box className="flex flex-col gap-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédios</h1>
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                        <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Listagem</h1>
                    </Box>

                    <EditModal
                        edit={edit}
                        modalEdit={modalEdit}
                        handleChangeModalEdit={() => setModalEdit(!modalEdit)}
                    />

                    <Button
                        href='/locais/predio/cadastro'
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                    >
                        <FiPlus size={25} />
                        Cadastrar Prédio
                    </Button>

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
        </>
    );
}