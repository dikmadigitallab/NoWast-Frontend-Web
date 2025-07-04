'use client';

import React, { useState } from 'react';
import ReverseBar from './components/reverseBar';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';

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

  const data1 = {
    data: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
    categories: [
      'Falta',
      'Atestado',
      'Falta de máquina',
      'Mudança de prioridade cliente',
      'Mudança de prioridade dikma',
      'Quebra',
      'Manutenção',
      'Outro'
    ],
    color: '#FF5733'
  }

  const data2 = {
    data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    categories: [
      "Pátio de Carvão",
      "Tratamento de Gás",
      "Exemplo de nome",
      "Exemplo de nome",
      "Exemplo de nome",
      "Exemplo de nome",
      "Exemplo de nome"
    ],
    color: '#33FF57'
  }

  const data3 = {
    data: [2200, 2000, 1800, 1600, 1400, 1200, 1000, 800, 600, 400],
    categories: [
      "Pátio de Carvão",
      "Tratamento de Gás",
      "Falta de máquinas",
      "Mudança de prioridade ... cliente",
      "Mudança de prioridade Dikma",
      "Quebra",
      "Manutenção",
      "Outros"
    ],
    color: '#3357FF'
  }

  const dateOptions = [
    "Últimos 7 dias",
    "Últimos 30 dias",
    "Este mês",
    "Mês passado",
    "Este ano"
  ];


  return (
    <StyledMainContainer style={{ background: "#f8f8f8" }}>

      <Box className="w-[100%] bg-[#fff] p-5 flex flex-row justify-between items-center gap-5 rounded-lg mb-5 ">
        <h1 className="text-2xl font-bold text-[#5E5873]">
          Localização
        </h1>

        <Box className="w-[15%] flex flex-wrap gap-2 mt-5 float-right">
          <FormControl sx={formTheme} className="w-[100%]">
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
        </Box>

      </Box>

      <Box className="flex flex-row gap-5 w-[100%] mb-5">

        <Box className="w-[33%] px-6 flex-row h-[400px] bg-white rounded-lg">
          <h1 className="text-2xl font-medium text-[#5E5873] p-7 flex items-center justify-center">Setor</h1>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#E5F8EE] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#28C76F' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Maior Volume de Limpeza</Box>
            </Box>

            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Pátio de Carvão</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">2,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
          </Box>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#FFF3E8] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#FF9F43' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Menor Volume de Limpeza</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">C1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Recebimentos</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">TT1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
          </Box>
        </Box>
        <Box className="w-[33%] px-6 flex-row h-[400px] bg-white rounded-lg">
          <h1 className="text-2xl font-medium text-[#5E5873] p-7 flex items-center justify-center">Setor</h1>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#E5F8EE] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#28C76F' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Maior Volume de Limpeza</Box>
            </Box>

            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Pátio de Carvão</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">2,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
          </Box>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#FFF3E8] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#FF9F43' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Menor Volume de Limpeza</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">C1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Recebimentos</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">TT1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
          </Box>
        </Box>
        <Box className="w-[33%] px-6 flex-row h-[400px] bg-white rounded-lg">
          <h1 className="text-2xl font-medium text-[#5E5873] p-7 flex items-center justify-center">Setor</h1>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#E5F8EE] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#28C76F' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Maior Volume de Limpeza</Box>
            </Box>

            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Pátio de Carvão</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">2,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Tratamento de Gás</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">3,450 m²</Box>
            </Box>
          </Box>
          <Box className="mb-5">
            <Box className="flex flex-row items-center gap-3 mb-2">
              <Box className="w-[50px] h-[50px] flex justify-center items-center  text-[#5E5873] bg-[#FFF3E8] rounded-full">
                <MdOutlineKeyboardDoubleArrowUp size={30} color='#FF9F43' />
              </Box>
              <Box className="text-[#5E5873] font-medium">Menor Volume de Limpeza</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">C1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">Recebimentos</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
            <Box className="w-[100%] flex flex-row items-center">
              <Box className="text-[#5E5873] font-medium">TT1</Box>
              <Box className="flex-grow border-t border-dashed border-[#C4C4C4] mx-2"></Box>
              <Box className="text-[#5E5873] font-medium">121 m²</Box>
            </Box>
          </Box>
        </Box>

      </Box>

      <Box className="flex flex-col gap-5 w-[100%] ">

        <Box className="flex flex-col gap-5 p-7 w-[100%] items-start justify-between bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-[#5E5873]">QTD. de M² Limpo por SETOR</h1>
          <ReverseBar chart={data1} />
        </Box>

        <Box className="flex flex-col gap-5 p-7 w-[100%] items-start justify-between bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-[#5E5873]">QTD. de M² Limpo por AMBIENTE</h1>
          <ReverseBar chart={data2} />
        </Box>

        <Box className="flex flex-col gap-5 p-7 w-[100%] items-start justify-between bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-[#5E5873]">QTD. de M² Limpo por TIPO</h1>
          <ReverseBar chart={data3} />
        </Box>

      </Box>

    </StyledMainContainer>
  );
}
