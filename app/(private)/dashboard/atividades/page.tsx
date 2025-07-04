'use client';

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SpilinesRow from './components/spilinesRow';
import DonutsRow from './components/donutsRow';
import ColumnChart from './components/column';
import { StyledMainContainer } from '@/app/styles/container/container';
import { formTheme } from '@/app/styles/formTheme/theme';
import ReverseBar from './components/reverseBar';

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
    // Aqui você pode adicionar lógica para filtrar os dados baseado nos seletores
  };

  const dataSpilines = [
    { name: 'series1', data: [31, 40, 28, 51, 42, 109, 100], color: '#a105e9' },
    { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41], color: '#08bdb4' },
    { name: 'series3', data: [50, 90, 40, 60, 80, 75, 55], color: '#2196f3' },
    { name: 'series4', data: [25, 50, 75, 25, 50, 75, 25], color: '#ff0040' },
  ];

  const dataDonuts = [
    [
      { name: 'Concluídas', total: 80, data: [11, 32, 45], color: '#a105e9' },
      { name: 'Em Aberto', total: 150, data: [31, 40, 28], color: '#08bdb4' },
      { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#2196f3' },
    ],
    [
      { name: 'Concluídas', total: 250, data: [31, 40, 28], color: '#6f08bd' },
      { name: 'Em Aberto', total: 140, data: [11, 32, 45], color: '#EA5455' },
      { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#2196f3' },
    ],
    [
      { name: 'Concluídas', total: 180, data: [11, 32, 45], color: '#2196f3' },
      { name: 'Em Aberto', total: 250, data: [31, 40, 28], color: '#14bd08' },
      { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#ff0040' },
    ],
  ];

  // Options for filters
  const dateOptions = [
    "Últimos 7 dias",
    "Últimos 30 dias",
    "Este mês",
    "Mês passado",
    "Este ano"
  ];

  const sectorOptions = [
    "Administrativo",
    "Operacional",
    "Financeiro",
    "RH",
    "Engenharia"
  ];

  const environmentOptions = [
    "Produção",
    "Desenvolvimento",
    "Testes",
    "Homologação",
    "Todos os ambientes"
  ];

  return (
    <StyledMainContainer style={{ background: "#f8f8f8" }}>
      <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
        <h1 className="text-2xl font-bold text-[#5E5873]">
          Atividades
        </h1>
        <Box className="w-[50%] flex flex-wrap gap-2 mt-5 float-right">
          <FormControl sx={formTheme} className="w-[30%]">
            <InputLabel>Data</InputLabel>
            <Select
              label="Data"
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
          <FormControl sx={formTheme} className="w-[30%]">
            <InputLabel>Setor</InputLabel>
            <Select
              label="Setor"
              name="setor"
              value={filters.setor}
              onChange={handleFilterChange}
            >
              {sectorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={formTheme} className="w-[30%]">
            <InputLabel>Ambiente</InputLabel>
            <Select
              label="Ambiente"
              name="ambiente"
              value={filters.ambiente}
              onChange={handleFilterChange}
            >
              {environmentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box className="flex flex-col gap-5 w-[100%] ">
        <Box className="flex gap-5 w-[100%] items-center justify-between">
          <SpilinesRow data={dataSpilines} />
        </Box>
        <Box className="flex w-[100%] justify-between gap-5">
          {dataDonuts.map((donutData, index) => (
            <Box key={index} className="flex w-[33.3%] justify-center bg-white p-5 rounded-lg shadow-md">
              <DonutsRow data={donutData} />
            </Box>
          ))}
        </Box>
        <Box className="flex flex-row items-end gap-5 w-[100%]">
          <Box className="w-[100%] bg-white rounded-lg">
            <ColumnChart />
          </Box>
          <Box className="flex gap-5 w-[100%] items-center justify-between bg-white rounded-lg">
            <ReverseBar />
          </Box>
        </Box>
      </Box>

    </StyledMainContainer>
  );
}