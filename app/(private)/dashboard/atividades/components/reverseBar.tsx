import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Justification = {
  reasonType: string;
  justification: number;
  internalJustification: number;
  totalJustifications: number;
};

type Props = {
  justificationsByReasonType: Justification[];
  totalInternalJustifiedActivities: number;
  totalJustifications: number;
  totalJustifiedActivities: number;
};

export default function ReverseBar({
  justificationsByReasonType,
}: Props) {
  const categories = justificationsByReasonType?.map((item) => item.reasonType) || [];
  const values = justificationsByReasonType?.map((item) => item.totalJustifications) || [];

  const chartData: { series: ApexAxisChartSeries; options: ApexOptions } = {
    series: [
      {
        name: 'Total de justificativas',
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
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '16px',
        },
        y: {
          formatter: function (val: number) {
            return val + ' justificativas';
          },
        },
      },
      xaxis: {
        categories: categories,
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
