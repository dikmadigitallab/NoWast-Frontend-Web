'use client';

import React, { useEffect, useState } from 'react';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdKeyboardDoubleArrowDown, MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { useAuthStore } from '@/app/store/storeApp';
import { useGetDashboardLocation } from '@/app/hooks/dashboard/useGetLocation';
import ReverseBar from './components/reverseBar';
import BasicDateRangePicker from '@/app/components/dateRange';

export default function Atividades() {

  const { userType } = useAuthStore();
  const [filters, setFilters] = useState({ endDate: '', startDate: '', colaborador: '', setor: '', ambiente: '', empresa: '', predio: '' });
  const { environmentActivities, sectorActivities } = useGetDashboardLocation({ startDate: filters.startDate ? filters.startDate : "2025-01-01", endDate: filters.endDate ? filters.endDate : "2025-12-31" })

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };


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
    color: '#7367F0'
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
    color: '#2190FF'
  }

  const collaboratorOptions = [
    "todos",
    "Todos os colaboradores",
    "João Paulo",
    "Maria Silva",
    "Pedro Henrique",
    "Ana Luiza"
  ];

  const empresaOptions = [
    "todas",
    "Adcos",
    "Acelormittal",
    "Nemak"
  ];

  const predioOptions = [
    "todos",
    "Coqueria",
    "Sinterização",
    "Alto Forno"
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
          Localização
        </h1>

        <Box className="w-[70%] flex flex-wrap justify-end gap-2">
          <FormControl sx={formTheme} className="w-[30%]">
            <BasicDateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
            />
          </FormControl>
          <FormControl sx={formTheme} className="w-[23%]">
            <InputLabel>Colaborador</InputLabel>
            <Select
              label="Colaborador"
              name="colaborador"
              value={filters.colaborador}
              onChange={handleFilterChange}
            >
              {collaboratorOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {
            userType === "DIKMA_DIRECTOR" ? (
              <FormControl sx={formTheme} className="w-[23%]">
                <InputLabel>Empresa</InputLabel>
                <Select
                  label="Empresa"
                  name="empresa"
                  value={filters?.empresa}
                  onChange={handleFilterChange}
                >
                  {empresaOptions?.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) :
              null
          }

          {
            userType === "DIKMA_DIRECTOR" || userType === "GESTAO" ? (
              <FormControl sx={formTheme} className="w-[23%]">
                <InputLabel>Prédio</InputLabel>
                <Select
                  label="Prédio"
                  name="predio"
                  value={filters.predio}
                  onChange={handleFilterChange}
                >
                  {predioOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) :
              null
          }

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
                <MdKeyboardDoubleArrowDown size={30} color='#FF9F43' />
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
          <h1 className="text-2xl font-medium text-[#5E5873] p-7 flex items-center justify-center">Ambiente</h1>
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
                <MdKeyboardDoubleArrowDown size={30} color='#FF9F43' />
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
          <h1 className="text-2xl font-medium text-[#5E5873] p-7 flex items-center justify-center">Tipo</h1>
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
                <MdKeyboardDoubleArrowDown size={30} color='#FF9F43' />
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
          <h1 className="text-2xl font-medium text-[#5E5873]">QTD. de M² Limpo por SETOR</h1>
          <ReverseBar data={environmentActivities || []} />
        </Box>

        <Box className="flex flex-col gap-5 p-7 w-[100%] items-start justify-between bg-white rounded-lg">
          <h1 className="text-2xl font-medium text-[#5E5873]">QTD. de M² Limpo por AMBIENTE</h1>
          <ReverseBar data={sectorActivities || []} />
        </Box>

      </Box>

    </StyledMainContainer>
  );
}
