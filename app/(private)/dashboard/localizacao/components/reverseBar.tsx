import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type EnvironmentOrSector = {
  environmentId?: number;
  environmentName?: string;
  sectorId?: number;
  sectorName?: string;
  totalActivities: number;
  totalAreaM2: number;
};

type Props = {
  data: EnvironmentOrSector[];
};

export default function ReverseBar({ data }: Props) {
  const categories = data.map((item) => item.environmentName || item.sectorName || '');
  const values = data.map((item) => item.totalActivities);

  // Define cores fixas dependendo se é environment ou sector
  const colors = data.map((item) =>
    item.environmentId ? '#29c770' : '#7367F0'
  );

  const chartData: { series: ApexAxisChartSeries; options: ApexOptions } = {
    series: [
      {
        name: 'Total de atividades',
        data: values,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: true, // habilita labels dentro das barras
        style: {
          colors: ['#ffffff'], // branco
          fontSize: '14px',
          fontWeight: 'bold',
        },
        formatter: function (val: number) {
          return `Atividades: ${val.toString()}`; // mostra o valor dentro da barra
        },
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '16px',
        },
        y: {
          formatter: function (val: number) {
            return val + ' atividades';
          },
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (value: string) {
            return Math.round(Number(value)).toString();
          },
        },
      },
    },
  };

  return (
    <Box className="w-full h-full">
      <Box id="chart" className="w-full h-full">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={550}
        />
      </Box>
    </Box>
  );
}
