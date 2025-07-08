'use client';

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SpilinesRow from './components/spilinesRow';
import DonutsRow from './components/donutsRow';
import ColumnChart from './components/column';
import { StyledMainContainer } from '@/app/styles/container/container';
import { formTheme } from '@/app/styles/formTheme/theme';
import ReverseBar from './components/reverseBar';
import { MdOutlineChecklist } from 'react-icons/md';
import { CiCircleCheck } from 'react-icons/ci';
import { BsExclamationDiamond, BsExclamationSquare } from "react-icons/bs";

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

  const dataSpilines = [
    { name: 'series1', icon: <MdOutlineChecklist size={24} color='#fff' />, data: [31, 40, 28, 51, 42, 109, 100], color: '#a105e9' },
    { name: 'series2', icon: <CiCircleCheck size={27} color='#fff' />, data: [11, 32, 45, 32, 34, 52, 41], color: '#00f968' },
    { name: 'series3', icon: <BsExclamationSquare size={24} color='#fff' />, data: [50, 90, 40, 60, 80, 75, 55], color: '#2196f3' },
    { name: 'series4', icon: <BsExclamationDiamond size={24} color='#fff' />, data: [25, 50, 75, 25, 50, 75, 25], color: '#ff0040' },
  ];

  const dataDonuts = [
    {
      title: "Atividades Gerais",
      data: [
        { name: 'Concluídas', total: 80, data: [11, 32, 45], color: '#a105e9' },
        { name: 'Em Aberto', total: 150, data: [31, 40, 28], color: '#08bdb4' },
        { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#2196f3' },
      ]
    },
    {
      title: "Execuções",
      data: [
        { name: 'Concluídas', total: 250, data: [31, 40, 28], color: '#6f08bd' },
        { name: 'Em Aberto', total: 140, data: [11, 32, 45], color: '#EA5455' },
        { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#2196f3' },
      ]
    },
    {
      title: "Aprovações",
      data: [
        { name: 'Concluídas', total: 180, data: [11, 32, 45], color: '#2196f3' },
        { name: 'Em Aberto', total: 250, data: [31, 40, 28], color: '#14bd08' },
        { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#ff0040' },
      ]
    }
  ];


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
        <h1 className="text-2xl font-medium text-[#5E5873]">
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

      <Box className="flex flex-col gap-5 w-[100%]">
        <Box className="flex gap-5 w-[100%] items-center justify-between">
          <SpilinesRow data={dataSpilines} />
        </Box>
        <Box className="flex w-[100%] justify-between gap-5">
          {dataDonuts.map((donutData, index) => (
            <Box key={index} className="flex flex-col items-center gap-5 w-[33.3%] justify-center bg-white p-5 rounded-lg shadow-md">
              <h1 className="text-2xl font-medium text-[#5E5873]">{donutData.title}</h1>
              <DonutsRow data={donutData.data} />
            </Box>
          ))}
        </Box>
        <Box className="flex flex-row items-end gap-5 w-[100%]">
          <Box className="w-[100%] bg-white rounded-lg p-5">
            <h1 className="text-2xl font-medium text-[#5E5873]">Ocorrências</h1>
            <ColumnChart />
          </Box>
          <Box className="w-[100%] bg-white rounded-lg p-5">
            <h1 className="text-2xl font-medium text-[#5E5873]">Motivos das Justificativas</h1>
            <ReverseBar />
          </Box>
        </Box>
      </Box>
    </StyledMainContainer>
  );
}