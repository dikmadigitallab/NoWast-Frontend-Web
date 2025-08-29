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
import { useGetDashboardActivities } from '@/app/hooks/dashboard/useGetActivities';
import { useGetDashboardJustifications } from '@/app/hooks/dashboard/useGetJustifications';
import BasicDateRangePicker from '@/app/components/dateRange';

export default function Atividades() {

  const { userType } = useAuthStore();
  const [filters, setFilters] = useState({ endDate: '', startDate: '', colaborador: '', setor: '', ambiente: '' });
  const { data: atividades } = useGetDashboardActivities({ startDate: filters.startDate ? filters.startDate : "2025-01-01", endDate: filters.endDate ? filters.endDate : "2025-12-31" });
  const { data: justifications } = useGetDashboardJustifications({ startDate: filters.startDate ? filters.startDate : "2025-01-01", endDate: filters.endDate ? filters.endDate : "2025-12-31" });

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
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
        { name: 'Justificativas Internas', total: atividades?.internalJustificationActivities ?? 0, color: '#d35400' },
        { name: 'Justificativas Externas', total: atividades?.justifiedActivities ?? 0, color: '#27ae60' },
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

  const collaboratorOptions = [
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
          Atividades
        </h1>

        <Box className="w-[90%] flex flex-wrap justify-end gap-2">
          <FormControl sx={formTheme} className="w-[30%]">
            <BasicDateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
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
                  label="Prédio"
                  name="predio"
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
          {dataDonuts.map((donut, index) => (
            <Box key={index} className="mb-10 w-[32%] h-full">
              <h2 className="text-xl font-bold mb-4 text-center">{donut.title}</h2>
              {donut.data.some(item => item.total > 0) ? (
                <DonutsRow data={donut.data} />
              ):
                <Box className="w-full h-[520px] flex items-center justify-center bg-white p-5 rounded-lg ">
                  <span className="text-[#5E5873] font-semibold">Nenhum dado disponível para esse período</span>
                </Box>
            }
            </Box>
          ))}
        </Box>
        <Box className="w-[100%] bg-white rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#5E5873]">Ocorrências</h1>
          <ColumnChart />
        </Box>
        <Box className="w-[100%] bg-white rounded-lg p-5">
          <h1 className="text-2xl font-medium text-[#5E5873]">Motivos das Justificativas</h1>
          <ReverseBar {...justifications} />
        </Box>

      </Box>
    </StyledMainContainer>
  );
}