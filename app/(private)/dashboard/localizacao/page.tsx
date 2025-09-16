'use client';

import React, { useEffect, useState } from 'react';
import { formTheme } from '@/app/styles/formTheme/theme';
import { Box, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import { StyledMainContainer } from '@/app/styles/container/container';
import { MdKeyboardDoubleArrowDown, MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { useAuthStore } from '@/app/store/storeApp';
import { useGetDashboardLocation } from '@/app/hooks/dashboard/useGetLocation';
import ReverseBar from './components/reverseBar';
import BasicDateRangePicker from '@/app/components/dateRange';
import { useGetUsuario } from '@/app/hooks/usuarios/get';
import { useGet } from '@/app/hooks/crud/get/useGet';

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

export default function Atividades() {

  const { userType } = useAuthStore();
  const { data: predio } = useGet({ url: 'building' });
  const { data: pessoas, loading } = useGetUsuario({});
  const [filters, setFilters] = useState({ endDate: endOfMonth, startDate: startOfMonth, userId: '', sectorId: '', environmentId: '', buildingId: '', empresa: 'todas' });
  const { environmentActivities, sectorActivities, loading: loadingCadastros } = useGetDashboardLocation({
    startDate: filters.startDate ? filters.startDate : "2025-01-01",
    endDate: filters.endDate ? filters.endDate : "2025-12-31",
    userId: filters.userId,
    sectorId: filters.sectorId,
    environmentId: filters.environmentId,
    buildingId: filters.buildingId,
  })

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const empresaOptions = [
    "todas",
    "Adcos",
    "Acelormittal",
    "Nemak"
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
          <FormControl sx={formTheme} >
            <BasicDateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
            />
          </FormControl>

          <FormControl sx={formTheme} className="w-[12%]">
            <InputLabel>Colaborador</InputLabel>
            <Select
              disabled={loading}
              label="Colaborador"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
            >
              <MenuItem value="" disabled>Selecione um colaborador...</MenuItem>
              {Array?.isArray(pessoas) && pessoas.map((pessoa) => (
                <MenuItem key={pessoa?.id} value={pessoa?.id}>
                  {pessoa?.name}
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
          {loading || loadingCadastros ? (
            <Skeleton variant="rectangular" height={300} width={"100%"} />
          ) : (
            <ReverseBar data={environmentActivities || []} />
          )}
        </Box>

        <Box className="flex flex-col gap-5 p-7 w-[100%] items-start justify-between bg-white rounded-lg">
          <h1 className="text-2xl font-medium text-[#5E5873]">QTD. de M² Limpo por AMBIENTE</h1>
          {loading || loadingCadastros ? (
            <Skeleton variant="rectangular" height={300} width={"100%"} />
          ) : (
            <ReverseBar data={sectorActivities || []} />
          )}
        </Box>

      </Box>

    </StyledMainContainer>
  );
}
