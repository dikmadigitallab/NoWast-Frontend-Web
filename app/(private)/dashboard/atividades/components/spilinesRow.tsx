'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { BsExclamationDiamond, BsExclamationSquare } from 'react-icons/bs';
import { MdOutlineChecklist } from 'react-icons/md';
import { CiCircleCheck } from 'react-icons/ci';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const transformDataForChart = (rawData: any[]) => {

  const colors = ['#e74c3c', '#2090FF', '#FF9920', '#00CB65'];

  return [
    {
      icon: <MdOutlineChecklist size={24} color='#fff' />,
      name: "Total",
      data: rawData.map(item => item.totalActivities),
      color: colors[0],
      total: rawData.reduce((sum, item) => sum + item.totalActivities, 0)
    },
    {
      icon: <BsExclamationSquare size={24} color='#fff' />,
      name: "Abertas",
      data: rawData.map(item => item.openActivities),
      color: colors[1],
      total: rawData.reduce((sum, item) => sum + item.openActivities, 0)
    },
    {
      icon: <BsExclamationDiamond size={24} color='#fff' />,
      name: "Pendentes",
      data: rawData.map(item => item.pendingActivities),
      color: colors[2],
      total: rawData.reduce((sum, item) => sum + item.pendingActivities, 0)
    },
    {
      icon: <CiCircleCheck size={27} color='#fff' />,
      name: "Concluídas",
      data: rawData.map(item => item.completedActivities),
      color: colors[3],
      total: rawData.reduce((sum, item) => sum + item.completedActivities, 0)
    }
  ];
};

export default function SpilinesRow({ data }: any) {

  if (data.length === 0) {
    return (
      <Box className="flex items-center justify-center w-full h-[180px] bg-[#fff] rounded-lg relative overflow-hidden text-center">
        <span className="text-[#5E5873] font-semibold">Nenhum dado disponível para esse período</span>
      </Box>);
  }

  const [chartData] = useState(transformDataForChart(data));

  return (
    <>
      {chartData.map((item: any, index: any) => (
        <Box
          key={index}
          className="flex flex-col justify-between w-[25%] h-[180px] bg-[#fff] rounded-lg relative overflow-hidden"
          sx={{ position: 'relative' }}
        >
          <Box className="flex flex-row items-center gap-3 mt-5 ml-5 z-10 relative">
            <Box
              style={{ background: `${item.color}` }}
              className="p-3 rounded-full z-10">
              {item.icon}
            </Box>
            <Box className="flex flex-col z-10">
              {/* MOSTRA A SOMA TOTAL EM VEZ DO ÚLTIMO VALOR */}
              <span className='text-[#5E5873] text-[1.5rem] font-bold'>
                {item.total}
              </span>
              <span className='text-[#5E5873] text-[1rem] font-medium mt-[-5px]'>
                {item.name}
              </span>
            </Box>
          </Box>

          <Box
            className="absolute bottom-0 left-0 w-full h-[100px] rounded-b-lg"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100px',
              zIndex: 1
            }}
          >
            <ReactApexChart
              options={{
                chart: {
                  height: '100%',
                  type: 'area',
                  toolbar: { show: false },
                  sparkline: { enabled: true },
                  animations: { enabled: false }
                },
                dataLabels: { enabled: false },
                stroke: {
                  curve: 'smooth',
                  width: 2
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                    stops: [0, 90, 100]
                  }
                },
                tooltip: {
                  theme: 'dark',
                  style: { fontSize: '16px' },
                  y: {
                    formatter: function (val: number) {
                      return val + " ocorrências";
                    }
                  }
                },
                xaxis: {
                  labels: { show: false },
                  axisTicks: { show: false },
                  axisBorder: { show: false },
                },
                yaxis: { show: false },
                grid: {
                  show: false,
                  padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                  }
                },
                colors: [item.color],
              }}
              series={[{
                name: item.name,
                data: item.data
              }]}
              type="area"
              height="100%"
              width="100%"
            />
          </Box>
        </Box>
      ))}
    </>
  );
};