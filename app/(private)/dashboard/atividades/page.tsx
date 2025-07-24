'use client';

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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
    colaborador: 'todos',
    setor: 'todos',
    ambiente: 'todos'
  });

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dataSpilines = [
    { name: 'Total', icon: <MdOutlineChecklist size={24} color='#fff' />, data: [61, 31, 61, 131, 31, 71, 131], color: '#a105e9', tension: 0.9 },
    { name: 'Concluídas', icon: <CiCircleCheck size={27} color='#fff' />, data: [11, 32, 45, 32, 34, 52, 41], color: '#00f968', tension: 0.9 },
    { name: 'Em Aberto', icon: <BsExclamationSquare size={24} color='#fff' />, data: [50, 90, 40, 60, 80, 75, 55], color: '#2196f3', tension: 0.9 },
    { name: 'Pendentes', icon: <BsExclamationDiamond size={24} color='#fff' />, data: [25, 50, 75, 25, 50, 75, 25], color: '#ff0040', tension: 0.9 },
  ];

  const dataDonuts = [
    {
      title: "Atividades",
      data: [
        { name: 'Concluídas', total: 80, data: [11, 32, 45], color: '#a105e9' },
        { name: 'Em Aberto', total: 150, data: [31, 40, 28], color: '#08bdb4' },
        { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#2196f3' },
        { name: 'Justificadas', total: 150, data: [50, 90, 40], color: '#ff0040' },
      ]
    },
    {
      title: "Execuções",
      data: [
        { name: 'No Prazo', total: 250, data: [31, 40, 28], color: '#6f08bd' },
        { name: 'Fora do Prazo', total: 140, data: [11, 32, 45], color: '#EA5455' }
      ]
    },
    {
      title: "Aprovações",
      data: [
        { name: 'Apovadas', total: 180, data: [11, 32, 45], color: '#2196f3' },
        { name: 'Não Aprovadas', total: 250, data: [31, 40, 28], color: '#14bd08' },
        { name: 'Reprovadas', total: 120, data: [50, 90, 40], color: '#ff0040' },
      ]
    }
  ];

  const sectorOptions = [
    "todos",
    "Administrativo",
    "Operacional",
    "Financeiro",
    "RH",
    "Engenharia"
  ];

  const environmentOptions = [
    "todos",
    "Produção",
    "Desenvolvimento",
    "Testes",
    "Homologação",
    "Todos os ambientes"
  ];

  const collaboratorOptions = [
    "todos",
    "Todos os colaboradores",
    "João Paulo",
    "Maria Silva",
    "Pedro Henrique",
    "Ana Luiza"
  ];

  return (
    <StyledMainContainer style={{ background: "#f8f8f8" }}>

      <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
        <h1 className="text-2xl font-medium text-[#5E5873]">
          Atividades
        </h1>

        <Box className="w-[70%] flex flex-wrap justify-end gap-2">
          <FormControl sx={formTheme} className="w-[20%]">
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
          <FormControl sx={formTheme} className="w-[20%]">
            <InputLabel>Colaborador</InputLabel>
            <Select
              label="Colaborador"
              name="colaborador"
              value={filters.colaborador}
              onChange={handleFilterChange}
            >
              {collaboratorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={formTheme} className="w-[20%]">
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
          <FormControl sx={formTheme} className="w-[20%]">
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