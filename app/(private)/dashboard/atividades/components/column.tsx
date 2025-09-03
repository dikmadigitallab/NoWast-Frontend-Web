'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface OccurrenceByHour {
  hour: string;
  totalSevere: number;
  totalMild: number;
  totalNone: number;
}

interface OccurrenceByDay {
  day: string;
  occurrenceByHour: OccurrenceByHour[];
}

interface ChartData {
  totalOccurrences: number;
  occurrenceByDay: OccurrenceByDay[];
}

export default function ColumnChart({ data }: { data?: ChartData }) {

  // Processar os dados para o formato necessário pelo chart
  const processChartData = () => {
    if (!data?.occurrenceByDay) {
      return {
        series: [
          { name: 'Nenhum', data: [] },
          { name: 'Leve', data: [] },
          { name: 'Grave', data: [] }
        ],
        categories: []
      };
    }

    // Extrair apenas o dia do formato ISO (ex: "2025-08-27" -> "27/08")
    const categories = data.occurrenceByDay.map(item => {
      const date = new Date(item.day);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    });

    // Inicializar arrays para cada tipo de ocorrência
    const noneData: number[] = [];
    const mildData: number[] = [];
    const severeData: number[] = [];

    // Preencher os dados para cada dia
    data.occurrenceByDay.forEach(day => {
      let totalNone = 0;
      let totalMild = 0;
      let totalSevere = 0;

      // Somar ocorrências por hora para este dia
      day.occurrenceByHour.forEach(hour => {
        totalNone += hour.totalNone;
        totalMild += hour.totalMild;
        totalSevere += hour.totalSevere;
      });

      noneData.push(totalNone);
      mildData.push(totalMild);
      severeData.push(totalSevere);
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