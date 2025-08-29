import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface UserData {
  date: string;
  activeUsers: number;
  createdUsers: number;
  deletedUsers: number;
}

interface CadastroColumnChartProps {
  data: UserData[];
}

const CadastroColumnChart = ({ data }: CadastroColumnChartProps) => {
  const processedData = React.useMemo(() => {
    const labels = data?.map(item => item.date) || [];
    const createdUsers = data?.map(item => item.createdUsers) || [];
    const deletedUsers = data?.map(item => item.deletedUsers) || [];
    const activeUsers = data?.map(item => item.activeUsers) || [];

    return { labels, createdUsers, deletedUsers, activeUsers };
  }, [data]);

  const chartOptions = React.useMemo<ApexOptions>(() => ({
    chart: {
      type: 'line',
      height: 350,
      stacked: false,
      locales: [{
        name: 'pt-BR',
        options: {
          months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
          shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          toolbar: {
            exportToCSV: 'Exportar para CSV',
            exportToSVG: 'Exportar para SVG',
            selection: 'Seleção',
            selectionZoom: 'Zoom de seleção',
            zoomIn: 'Ampliar',
            zoomOut: 'Reduzir',
            pan: 'Mover',
            reset: 'Resetar'
          }
        }
      }],
      defaultLocale: 'pt-BR'
    },
    colors: ['#2196F3', '#C5F7E3', '#f39c12'],
    stroke: { width: [0, 2, 5], curve: 'smooth' },
    plotOptions: { bar: { columnWidth: '50%' } },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: { inverseColors: false, shade: 'light', type: 'vertical', opacityFrom: 0.85, opacityTo: 0.55, stops: [0, 100, 100, 100] }
    },
    labels: processedData.labels,
    markers: { size: 0 },
    xaxis: { type: 'datetime', labels: { datetimeFormatter: { year: 'yyyy', month: 'MMM/yy', day: 'dd/MM', hour: 'HH:mm' } } },
    tooltip: {
      shared: true,
      intersect: false,
      x: { format: 'dd/MM/yyyy' },
      y: { formatter: (y: number) => y !== undefined ? `${y.toFixed(0)} Contratos` : y }
    }
  }), [processedData]);

  const chartSeries = React.useMemo(() => [
    { name: 'Inicio de Contrato', data: processedData.createdUsers, type: 'column' },
    { name: 'Fim de Contrato', data: processedData.deletedUsers, type: 'area' },
    { name: 'Pessoas Ativas', data: processedData.activeUsers, type: 'line' }
  ], [processedData]);

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={350}
    />
  );
}

export default CadastroColumnChart;