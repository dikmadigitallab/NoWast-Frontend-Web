"use client";

import { rows } from './data';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';
import { FiPlus } from 'react-icons/fi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme } from '@/app/styles/buttonTheme/theme';
import ModalAmbienteEditModal from './component/AmbienteEdit/modalAmbienteEdit';
import ModalVisualizeDetail from './component/modalAmbienteDetail';

export default function DataGridAtividades() {

    const [edit, setEdit] = useState<any>(null);
    const [modalEdit, setModalEdit] = useState(false);

    const [visualize, setVisualize] = useState<any>(null);
    const [modalVisualize, setModalVisualize] = useState(false);

    const handleChangeModalEdit = (data: any) => {
        setEdit(data);
        setModalEdit(!modalEdit);
    }

    const handleChangeModalVisualize = (data: any) => {
        setVisualize(data);
        setModalVisualize(!modalVisualize);
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
                    <IconButton aria-label="editar" size="small" onClick={() => handleChangeModalEdit(params.row)}>
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
            field: 'nome',
            headerName: 'Nome do Ambiente',
            width: 200,
        },
        {
            field: 'raio',
            headerName: 'Raio',
            width: 120,
        },
        {
            field: 'servico',
            headerName: 'Serviço',
            width: 150,
        },
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 150,
        },
        {
            field: 'descricao',
            headerName: 'Descrição',
            width: 300,
            flex: 1,
        },
    ];



    return (
        <StyledMainContainer>

            <Box className="flex flex-col gap-2">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Atividades</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Listagem</h1>
                </Box>

                <ModalVisualizeDetail modalVisualize={visualize} handleChangeModalVisualize={handleChangeModalVisualize} />
                <ModalAmbienteEditModal edit={edit} modalEdit={modalEdit} handleChangeModalEdit={handleChangeModalEdit} />

                <Button
                    href="/atividade/cadastro"
                    type="submit"
                    variant="outlined"
                    sx={[buttonTheme, { alignSelf: "end" }]}
                >
                    <FiPlus size={25} />
                    Cadastrar Atividade
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
        </StyledMainContainer >
    );
}