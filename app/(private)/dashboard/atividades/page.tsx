'use client';

import React, { useEffect, useState } from 'react';
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
import { useAuthStore } from '@/app/store/storeApp';

export default function Atividades() {

  const { userType } = useAuthStore();
  const [filters, setFilters] = useState({ data: '', colaborador: 'todos', setor: 'todos', ambiente: 'todos' });

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dataSpilines = [
    { name: 'Total', icon: <MdOutlineChecklist size={24} color='#fff' />, data: [61, 31, 61, 131, 31, 71, 131], color: '#e74c3c', tension: 0.9 },
    { name: 'Concluídas', icon: <CiCircleCheck size={27} color='#fff' />, data: [11, 32, 45, 32, 34, 52, 41], color: '#2ecc71', tension: 0.9 },
    { name: 'Em Aberto', icon: <BsExclamationSquare size={24} color='#fff' />, data: [50, 90, 40, 60, 80, 75, 55], color: '#f39c12', tension: 0.9 },
    { name: 'Pendentes', icon: <BsExclamationDiamond size={24} color='#fff' />, data: [25, 50, 75, 25, 50, 75, 25], color: '#e67e22', tension: 0.9 }, // tom de laranja mais escuro
  ];

  const dataDonuts = [
    {
      title: "Atividades",
      data: [
        { name: 'Concluídas', total: 80, data: [11, 32, 45], color: '#2ecc71' }, // verde
        { name: 'Em Aberto', total: 150, data: [31, 40, 28], color: '#f39c12' }, // laranja
        { name: 'Aprovações', total: 120, data: [50, 90, 40], color: '#e74c3c' }, // vermelho
        { name: 'Justificativas Internas', total: 70, data: [50, 90, 40], color: '#d35400' }, // laranja escuro
        { name: 'Justificativas Externas', total: 80, data: [50, 90, 40], color: '#27ae60' }, // verde escuro
      ]
    },
    {
      title: "Execuções",
      data: [
        { name: 'No Prazo', total: 250, data: [31, 40, 28], color: '#2ecc71' },
        { name: 'Fora do Prazo', total: 140, data: [11, 32, 45], color: '#e74c3c' },
      ]
    },
    {
      title: "Aprovações",
      data: [
        { name: 'Aprovadas', total: 180, data: [11, 32, 45], color: '#2ecc71' },
        { name: 'Não Aprovadas', total: 250, data: [31, 40, 28], color: '#e74c3c' },
        { name: 'Reprovadas', total: 120, data: [50, 90, 40], color: '#f39c12' },
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

  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return


  return (
    <StyledMainContainer style={{ background: "#f8f8f8" }}>

      <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
        <h1 className="text-2xl font-medium text-[#5E5873]">
          Atividades
        </h1>

        <Box className="w-[90%] flex flex-wrap justify-end gap-2">
          <FormControl sx={formTheme} className="w-[12%]">
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
          <FormControl sx={formTheme} className="w-[12%]">
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

          {
            userType === "DIKMA_DIRECTOR" || userType === "GESTAO" ? (
              <FormControl sx={formTheme} className="w-[12%]">
                <InputLabel>Prédios</InputLabel>
                <Select
                  label="Prédios"
                  name="predio"
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
            ) :
              null
          }

          <FormControl sx={formTheme} className="w-[12%]">
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
          <FormControl sx={formTheme} className="w-[12%]">
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
        <Box className="w-[100%] bg-white rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#5E5873]">Ocorrências</h1>
          <ColumnChart />
        </Box>
        <Box className="w-[100%] bg-white rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#5E5873]">Motivos das Justificativas</h1>
          <ReverseBar />
        </Box>

      </Box>
    </StyledMainContainer>
  );
}