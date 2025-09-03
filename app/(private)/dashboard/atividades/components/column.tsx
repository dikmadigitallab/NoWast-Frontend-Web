'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface OccurrenceByDay {
  date: string;
  totalOccurrences: number;
  totalSevere: number;
  totalMild: number;
  totalNone: number;
}

interface ChartData {
  totalOccurrences: number;
  totalSevere: number;
  totalMild: number;
  totalNone: number;
  occurrencesByDay: OccurrenceByDay[];
}

export default function ColumnChart({ data }: { data?: ChartData }) {
  console.log('Dados recebidos para o gráfico:', data);

  // Processar os dados para o formato necessário pelo chart
  const processChartData = () => {
    if (!data?.occurrencesByDay) {
      return {
        series: [
          { name: 'Nenhum', data: [] },
          { name: 'Leve', data: [] },
          { name: 'Grave', data: [] }
        ],
        categories: []
      };
    }

    // Extrair apenas o dia do formato ISO (ex: "2025-09-01" -> "01/09")
    const categories = data.occurrencesByDay.map(item => {
      const date = new Date(item.date);
      return `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
    });

    // Arrays para cada tipo de ocorrência
    const noneData: number[] = [];
    const mildData: number[] = [];
    const severeData: number[] = [];

    // Preencher os dados por dia
    data.occurrencesByDay.forEach(day => {
      noneData.push(day.totalNone);
      mildData.push(day.totalMild);
      severeData.push(day.totalSevere);
    });

    return {
      series: [
        { name: 'Nenhum', data: noneData },
        { name: 'Leve', data: mildData },
        { name: 'Grave', data: severeData }
      ],
      categories
    };
  };

  const chartData = processChartData();

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true }
    },
    colors: ['#768B95', '#FDE802', '#EA5455'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    xaxis: {
      type: 'category',
      categories: chartData.categories,
      labels: {
        rotate: -45,
        hideOverlappingLabels: true,
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Ocorrências'
      }
    },
    legend: {
      position: 'bottom',
      offsetY: 40
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' ocorrência(s)';
        }
      }
    }
  };

  return (
    <ReactApexChart
      type="bar"
      height={550}
      series={chartData.series}
      options={options}
    />
  );
}
