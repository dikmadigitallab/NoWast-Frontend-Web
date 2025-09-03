'use client';

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { BsExclamationDiamond, BsExclamationSquare } from "react-icons/bs";
import { StyledMainContainer } from '@/app/styles/container/container';
import { useGetDashboard } from '@/app/hooks/dashboard/useGet';
import BasicDateRangePicker from '@/app/components/dateRange';
import { formTheme } from '@/app/styles/formTheme/theme';
import { useGetUsuario } from '@/app/hooks/usuarios/get';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { MdOutlineChecklist } from 'react-icons/md';
import { useAuthStore } from '@/app/store/storeApp';
import React, { useEffect, useState } from 'react';
import SpilinesRow from './components/spilinesRow';
import ReverseBar from './components/reverseBar';
import { CiCircleCheck } from 'react-icons/ci';
import DonutsRow from './components/donutsRow';
import ColumnChart from './components/column';

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

export default function Atividades() {

  const { userType } = useAuthStore();
  const { data: setor } = useGet({ url: 'sector' });
  const { data: predio } = useGet({ url: 'building' });
  const { data: ambiente } = useGet({ url: 'environment' });
  const { data: pessoas, loading } = useGetUsuario({});
  const [filters, setFilters] = useState({ endDate: endOfMonth, startDate: startOfMonth, userId: '', sectorId: '', environmentId: '', buildingId: '' });

  // Estado unificado para os filtros de ocorrências
  const [ocorrenciaFilters, setOcorrenciaFilters] = useState({
    mes: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    ano: new Date().getFullYear().toString()
  });

  const { data: justifications } = useGetDashboard({
    url: 'dashboard/justifications',
    startDate: filters.startDate,
    endDate: filters.endDate,
    userId: filters.userId,
    sectorId: filters.sectorId,
    environmentId: filters.environmentId,
    buildingId: filters.buildingId
  });

  const { data: atividades } = useGetDashboard({
    url: 'dashboard/activities',
    startDate: filters.startDate,
    endDate: filters.endDate,
    userId: filters.userId,
    sectorId: filters.sectorId,
    environmentId: filters.environmentId,
    buildingId: filters.buildingId
  });

  const { data: ocorrencias } = useGetDashboard({
    url: 'dashboard/occurrences',
    startDate: `${ocorrenciaFilters.ano}-${ocorrenciaFilters.mes}-01`,
    endDate: `${ocorrenciaFilters.ano}-${ocorrenciaFilters.mes}-31`,
    userId: filters.userId,
    sectorId: filters.sectorId,
    environmentId: filters.environmentId,
    buildingId: filters.buildingId
  });

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função única para manipular mudanças nos filtros de ocorrências
  const handleOcorrenciaFilterChange = (event: any) => {
    const { name, value } = event.target;
    setOcorrenciaFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dataSpilines = [
    { name: 'Total', icon: <MdOutlineChecklist size={24} color='#fff' />, data: [61, 31, 61, 131, 31, 71, 131], color: '#e74c3c', tension: 0.9 },
    { name: 'Concluídas', icon: <CiCircleCheck size={27} color='#fff' />, data: [11, 32, 45, 32, 34, 52, 41], color: '#00CB65', tension: 0.9 },
    { name: 'Em Aberto', icon: <BsExclamationSquare size={24} color='#fff' />, data: [50, 90, 40, 60, 80, 75, 55], color: '#2090FF', tension: 0.9 },
    { name: 'Pendentes', icon: <BsExclamationDiamond size={24} color='#fff' />, data: [25, 50, 75, 25, 50, 75, 25], color: '#FF9920', tension: 0.9 },
  ];

  const dataDonuts = [
    {
      title: "Atividades",
      data: [
        { name: 'Concluídas', total: atividades?.completedActivities ?? 0, color: '#00CB65' },
        { name: 'Em Aberto', total: atividades?.openActivities ?? 0, color: '#2090FF' },
        { name: 'Pendentes', total: atividades?.pendingActivities ?? 0, color: '#FF9920' },
        { name: 'Just/ Internas', total: atividades?.internalJustificationActivities ?? 0, color: '#d35400' },
        { name: 'Just/ Externas', total: atividades?.justifiedActivities ?? 0, color: '#27ae60' },
      ]
    },
    {
      title: "Execuções",
      data: [
        { name: 'No Prazo', total: atividades?.sameDayClosureActivities ?? 0, color: '#00CB65' },
        { name: 'Fora do Prazo', total: atividades?.differentDayClosureActivities ?? 0, color: '#2090FF' },
      ]
    },
    {
      title: "Aprovações",
      data: [
        { name: 'Aprovadas', total: atividades?.approvedActivities ?? 0, color: '#00CB65' },
        { name: 'Pendentes de Aprovação', total: atividades?.pendingApprovalActivities ?? 0, color: '#2090FF' },
        { name: 'Reprovadas', total: atividades?.rejectedActivities ?? 0, color: '#FF9920' },
      ]
    }
  ];

  const empresaOptions = [
    "todas",
    "Adcos",
    "Acelormittal",
    "Nemak"
  ];

  // Opções para os selects de mês e ano
  const monthOptions = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  // Gerar opções de anos (dos últimos 5 anos até o ano atual)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

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
          <FormControl sx={formTheme}>
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
              <FormControl sx={formTheme} className="w-[12%]">
                <InputLabel>Empresa</InputLabel>
                <Select
                  label="Empresa"
                  name="empresa"
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

      <Box className="flex flex-col gap-5 w-[100%]">
        <Box className="flex gap-5 w-[100%] items-center justify-between">
          <SpilinesRow data={dataSpilines} />
        </Box>
        <Box className="flex w-[100%] justify-between gap-5">
          {dataDonuts.map((donut, index) => (
            <Box key={index} className="mb-10 w-[32%] h-full">
              <h2 className="text-xl font-bold mb-4 text-center">{donut.title}</h2>
              {donut.data.some(item => item.total > 0) ? (
                <DonutsRow data={donut.data} />
              ) :
                <Box className="w-full h-[520px] flex items-center justify-center bg-white p-5 rounded-lg ">
                  <span className="text-[#5E5873] font-semibold">Nenhum dado disponível para esse período</span>
                </Box>
              }
            </Box>
          ))}
        </Box>

        {/* Seção de Ocorrências com filtros de mês e ano */}
        <Box className="w-[100%] bg-white rounded-lg p-5">
          <Box className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium text-[#5E5873]">Ocorrências</h1>
            <Box className="flex gap-2">
              <FormControl sx={formTheme} className="w-[120px]">
                <InputLabel>Mês</InputLabel>
                <Select
                  name="mes"
                  value={ocorrenciaFilters.mes}
                  label="Mês"
                  onChange={handleOcorrenciaFilterChange}
                >
                  {monthOptions.map(month => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={formTheme} className="w-[100px]">
                <InputLabel>Ano</InputLabel>
                <Select
                  name="ano"
                  value={ocorrenciaFilters.ano}
                  label="Ano"
                  onChange={handleOcorrenciaFilterChange}
                >
                  {yearOptions.map(year => (
                    <MenuItem key={year.value} value={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <ColumnChart data={ocorrencias} />
        </Box>

        <Box className="w-[100%] bg-white rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#5E5873]">Motivos das Justificativas</h1>
          <ReverseBar {...justifications} />
        </Box>
      </Box>
    </StyledMainContainer>
  );
}