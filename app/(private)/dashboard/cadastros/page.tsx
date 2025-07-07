'use client';

import React, { useState } from 'react';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { FaHelmetSafety } from "react-icons/fa6";
import { RiToolsFill } from "react-icons/ri";
import { IoCarOutline } from 'react-icons/io5';
import { FiBox } from 'react-icons/fi';
import CadastroColumnChart from './components/column';
import ReverceChart from '../components/reverseBar';

export default function Atividades() {

    const [filters, setFilters] = useState({
        data: '',
        setor: '',
        ambiente: ''
    });

    const handleFilterChange = (event: any) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const dateOptions = [
        "Últimos 7 dias",
        "Últimos 30 dias",
        "Este mês",
        "Mês passado",
        "Este ano"
    ];

    const cards = [
        { title: "Equipamento", value: 925, icon: <RiToolsFill size={25} color="#5E5873" /> },
        { title: "Transporte", value: 925, icon: <IoCarOutline size={25} color="#5E5873" /> },
        { title: "EPI", value: 925, icon: <FaHelmetSafety size={25} color="#5E5873" /> },
        { title: "Protudos", value: 925, icon: <FiBox size={25} color="#5E5873" /> }
    ];

    const data3 = {
        data: [2200, 2000, 1800, 1600, 1400, 1200, 1000, 800, 600, 400],
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

    return (
        <StyledMainContainer style={{ background: "#f8f8f8" }}>

            <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
                <h1 className="text-2xl font-medium text-[#5E5873]">
                    Cadastros
                </h1>
                <Box className="flex flex-row flex-wrap gap-2 mt-5">
                    <FormControl sx={formTheme} className='w-[170px]'>
                        <InputLabel>Data</InputLabel>
                        <Select label="Data" name="data" value={filters.data} onChange={handleFilterChange}>
                            {dateOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={formTheme} className='w-[170px]'>
                        <InputLabel>Nível de Contrato</InputLabel>
                        <Select
                            label="Nível de Contrato"
                            name="data"
                            value={filters.data}
                            onChange={handleFilterChange}
                        >
                            {dateOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={formTheme} className='w-[170px]'>
                        <InputLabel>Ambiente</InputLabel>
                        <Select label="Ambiente" name="data" value={filters.data} onChange={handleFilterChange}>
                            {dateOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={formTheme} className='w-[170px]'>
                        <InputLabel>Prédios</InputLabel>
                        <Select
                            label="Prédios"
                            name="data"
                            value={filters.data}
                            onChange={handleFilterChange}
                        >
                            {dateOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={formTheme} className='w-[170px]'>
                        <InputLabel>Setor</InputLabel>
                        <Select
                            label="Setor"
                            name="data"
                            value={filters.data}
                            onChange={handleFilterChange}
                        >
                            {dateOptions.map((option) => (
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
                    <Box
                        key={index}
                        className="flex flex-row items-center gap-3 pl-5 w-[24%] h-[150px] bg-[#fff] rounded-sm"
                    >
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

            <Box className="w-full bg-[#fff] p-5 mt-5 rounded-lg">
                <CadastroColumnChart />
            </Box>

            <Box className="w-full bg-[#fff] p-5 mt-5 rounded-lg">
                <ReverceChart chart={data3} />
            </Box>

        </StyledMainContainer>
    );
}

