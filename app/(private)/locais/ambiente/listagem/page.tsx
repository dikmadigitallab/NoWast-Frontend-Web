"use client";

import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';
import { FiPlus } from 'react-icons/fi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff, MdOutlineModeEditOutline, MdOutlineVisibility } from 'react-icons/md';
import { buttonTheme, buttonThemeNoBackground } from '@/app/styles/buttonTheme/theme';
import ModalVisualizeDetail from './component/modalAmbienteDetail';
import { formTheme } from '@/app/styles/formTheme/theme';
import { GoDownload } from 'react-icons/go';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { useRouter } from 'next/navigation';
import { useGetIDStore } from '@/app/store/getIDStore';
import { useSectionStore } from '@/app/store/renderSection';

export default function DataGridAmbientes() {

    const router = useRouter();
    const { setId } = useGetIDStore();
    const [isFilter, setIsFilter] = useState(false);
    const { setSection } = useSectionStore();
    const { data: ambientes } = useGet({ url: "environment" });
    const [visualize, setVisualize] = useState<any>(null);
    const [modalVisualize, setModalVisualize] = useState(false);

    const handleChangeModalVisualize = (data: any) => {
        setVisualize(data);
        setModalVisualize(!modalVisualize);
    }

    const handleChangeModalEdit = (id: any) => {
        setId(id)
        setTimeout(() => {
            router.push(`/locais/ambiente/atualizar`);
        }, 500);
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
            field: 'name',
            headerName: 'Nome do Ambiente',
            width: 200,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            width: 200,
        },
        {
            field: 'areaM2',
            headerName: 'Área em m²',
            width: 120,
        },
        {
            field: 'sectorId',
            headerName: 'ID do Setor',
            width: 150,
        },
    ];

    useEffect(() => {
        setSection(1);
    }, [])

    return (
        <StyledMainContainer>

            <ModalVisualizeDetail modalVisualize={visualize} handleChangeModalVisualize={handleChangeModalVisualize} />

            <Box className="flex flex-col gap-5">
                <Box className="flex justify-between items-center w-full border-b border-[#F3F2F7] pb-2">
                    <Box className="flex gap-2">
                        <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Ambientes</h1>
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
                        <Button href="/locais/ambiente/cadastro" type="submit" variant="outlined" sx={buttonTheme}>
                            <FiPlus size={25} />
                            Cadastrar Ambiente
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
                    rows={ambientes}
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
        </StyledMainContainer >
    );
}