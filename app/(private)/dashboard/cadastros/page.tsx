'use client';

import React, { useState } from 'react';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { FaHelmetSafety } from "react-icons/fa6";
import { RiToolsFill } from "react-icons/ri";
import { IoCarOutline } from 'react-icons/io5';
import { FiBox } from 'react-icons/fi';
import { useAuthStore } from '@/app/store/storeApp';
import { useGetDashboardItems } from '@/app/hooks/dashboard/useGetItems';
import { useGetDashboardRegistrations } from '@/app/hooks/dashboard/useGetRegistrations';
import ReverseChart from './components/reverseBar';
import CadastroColumnChart from './components/column';
import BasicDateRangePicker from '@/app/components/dateRange';
import { useGet } from '@/app/hooks/crud/get/useGet';

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

export default function Atividades() {

    const { userType } = useAuthStore();
    const { data: setor } = useGet({ url: 'sector' });
    const { data: ambiente } = useGet({ url: 'environment' });
    const { data: predio, loading } = useGet({ url: 'building' });
    const [filters, setFilters] = useState({ endDate: endOfMonth, startDate: startOfMonth, userId: '', sectorId: '', environmentId: '', buildingId: '', empresa: '' });
    const { data: cadastros } = useGetDashboardItems({ startDate: filters.startDate ? filters.startDate : "2025-01-01", endDate: filters.endDate ? filters.endDate : "2025-12-31" })
    const { dailyStats, usersByPosition } = useGetDashboardRegistrations({ startDate: filters.startDate ? filters.startDate : "2025-01-01", endDate: filters.endDate ? filters.endDate : "2025-12-31" })

    const handleFilterChange = (event: any) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const cards = [
        { title: "Equipamento", value: cadastros?.totalTools, icon: <RiToolsFill size={25} color="#5E5873" /> },
        { title: "Transporte", value: cadastros?.totalTransports, icon: <IoCarOutline size={25} color="#5E5873" /> },
        { title: "EPI", value: cadastros?.totalPpes, icon: <FaHelmetSafety size={25} color="#5E5873" /> },
        { title: "Produtos", value: cadastros?.totalProducts, icon: <FiBox size={25} color="#5E5873" /> }
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
                    <FormControl sx={formTheme} className="w-[30%]">
                        <BasicDateRangePicker
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
                        />
                    </FormControl>

                    {
                        userType === "DIKMA_DIRECTOR" || userType === "GESTAO" ? (
                            <FormControl sx={formTheme} className="w-[12%]">
                                <InputLabel>Prédio</InputLabel>
                                <Select
                                    disabled={loading}
                                    label="Prédio"
                                    value={filters.buildingId}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, buildingId: e.target.value }))
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        Selecione um setor...
                                    </MenuItem>
                                    {Array?.isArray(predio) &&
                                        predio.map((predio) => (
                                            <MenuItem key={predio?.id} value={predio?.id}>
                                                {predio?.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        ) :
                            null
                    }


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

                    <FormControl sx={formTheme} className="w-[12%]">
                        <InputLabel>Setor</InputLabel>
                        <Select
                            disabled={loading}
                            label="Setor"
                            value={filters.sectorId}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, sectorId: e.target.value }))
                            }
                        >
                            <MenuItem value="" disabled>
                                Selecione um setor...
                            </MenuItem>
                            {Array?.isArray(setor) &&
                                setor.map((setor) => (
                                    <MenuItem key={setor?.id} value={setor?.id}>
                                        {setor?.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={formTheme} className="w-[12%]">
                        <InputLabel>Ambiente</InputLabel>
                        <Select
                            disabled={loading}
                            label="Ambiente"
                            value={filters.environmentId}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, environmentId: e.target.value }))
                            }
                        >
                            <MenuItem value="" disabled>
                                Selecione um setor...
                            </MenuItem>
                            {Array?.isArray(ambiente) &&
                                ambiente.map((ambiente) => (
                                    <MenuItem key={ambiente?.id} value={ambiente?.id}>
                                        {ambiente?.name}
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
                <CadastroColumnChart data={dailyStats || []} />
            </Box>

            <Box className="gap-5 p-7 w-[100%]  bg-white rounded-lg mb-5">
                <h1 className="text-2xl font-medium text-[#5E5873] mb-5">Total de Pessoas Por Cargo</h1>
                <ReverseChart data={usersByPosition} />
            </Box>
        </StyledMainContainer >
    );
}

