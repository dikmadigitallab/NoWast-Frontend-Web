'use client';

import React, { useEffect, useState } from 'react';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { FaHelmetSafety } from "react-icons/fa6";
import { RiToolsFill } from "react-icons/ri";
import { IoCarOutline } from 'react-icons/io5';
import { FiBox } from 'react-icons/fi';
import CadastroColumnChart from './components/column';
import ReverceChart from '../components/reverseBar';
import { useAuthStore } from '@/app/store/storeApp';

export default function Atividades() {

    const { userType } = useAuthStore();

    const [filters, setFilters] = useState({
        data: '',
        predio: '',
        setor: '',
        ambiente: '',
        empresa: ''
    });

    const handleFilterChange = (event: any) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const cards = [
        { title: "Equipamento", value: 925, icon: <RiToolsFill size={25} color="#5E5873" /> },
        { title: "Transporte", value: 925, icon: <IoCarOutline size={25} color="#5E5873" /> },
        { title: "EPI", value: 925, icon: <FaHelmetSafety size={25} color="#5E5873" /> },
        { title: "Produtos", value: 925, icon: <FiBox size={25} color="#5E5873" /> }
    ];

    const data3 = {
        data: [2200, 2000, 1800, 1600, 1400, 1200, 1000, 800],
        categories: [
            "ADM",
            "Operador",
            "Analista de Gestão e Estrutura",
            "Operador de Área",
            "Gestão",
            "Operador 2",
            "Operador 3",
            "Operador 4"
        ],
        color: '#7367F0'
    }

    const predioOptions = [
        "Predio 1",
        "Predio 2",
        "Predio 3",
        "Predio 4",
        "Predio 5"
    ];

    const setorOptions = [
        "Setor 1",
        "Setor 2",
        "Setor 3",
        "Setor 4",
        "Setor 5"
    ];

    const ambienteOptions = [
        "Ambiente 1",
        "Ambiente 2",
        "Ambiente 3",
        "Ambiente 4",
        "Ambiente 5"
    ];


    const empresaOptions = [
        "todas",
        "Adcos",
        "Acelormittal",
        "Nemak"
    ];

    return (
        <StyledMainContainer style={{ background: "#f8f8f8" }}>

            <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
                <h1 className="text-2xl font-medium text-[#5E5873]">
                    Cadastros
                </h1>

                <Box className="w-[80%] flex flex-wrap justify-end gap-2">
                    <FormControl sx={formTheme} className="w-[16%]">
                        <TextField
                            label="Data"
                            type="date"
                            name="data"
                            value={filters.data}
                            onChange={handleFilterChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={formTheme} className='w-[16%]'>
                        <InputLabel>Predio</InputLabel>
                        <Select
                            label="Predio"
                            name="predio"
                            value={filters.predio}
                            onChange={handleFilterChange}
                        >
                            {predioOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {
                        userType === "DIKMA_DIRECTOR" ? (
                            <FormControl sx={formTheme} className="w-[16%]">
                                <InputLabel>Empresa</InputLabel>
                                <Select
                                    label="Empresa"
                                    name="empresa"
                                    value={filters.empresa}
                                    onChange={handleFilterChange}
                                >
                                    {empresaOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : null
                    }

                    {
                        userType === "DIKMA_DIRECTOR" || userType === "GESTAO" ? (
                            <FormControl sx={formTheme} className='w-[16%]'>
                                <InputLabel>Setor</InputLabel>
                                <Select
                                    label="Setor"
                                    name="setor"
                                    value={filters.setor}
                                    onChange={handleFilterChange}
                                >
                                    {setorOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : null
                    }

                    <FormControl sx={formTheme} className='w-[16%]'>
                        <InputLabel>Ambiente</InputLabel>
                        <Select
                            label="Ambiente"
                            name="ambiente"
                            value={filters.ambiente}
                            onChange={handleFilterChange}
                        >
                            {ambienteOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box className="w-[100%] flex flex-row justify-between items-center rounded-lg flex-wrap">
                {cards.map((card, index) => (
                    <Box key={index} className="flex flex-row items-center gap-3 pl-5 w-[24%] h-[150px] bg-[#fff] rounded-sm">
                        <Box className="p-2 rounded-full bg-[#2A51631F]">
                            {card.icon}
                        </Box>
                        <Box className="flex flex-col">
                            <span className='text-[#5E5873] text-[1.5rem] font-bold'>{card.value}</span>
                            <span className='text-[#5E5873] text-[1.1rem] font-normal mt-[-5px]'>{card.title}</span>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box className="gap-5 p-7 w-[100%]  bg-white rounded-lg mb-5 mt-5">
                <h1 className="text-2xl font-medium text-[#5E5873] mb-5">Início e Fim do Contrado</h1>
                <CadastroColumnChart />
            </Box>

            <Box className="gap-5 p-7 w-[100%]  bg-white rounded-lg mb-5">
                <h1 className="text-2xl font-medium text-[#5E5873] mb-5">Total de Pessoas Por Cargo</h1>
                <ReverceChart chart={data3} />
            </Box>

        </StyledMainContainer >
    );
}

