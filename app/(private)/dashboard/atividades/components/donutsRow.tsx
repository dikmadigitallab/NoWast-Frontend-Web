import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartItem = {
    name: string;
    color: string;
    total: number;
};

type DonutChartProps = {
    data: ChartItem[];
};

export default function DonutsRow({ data }: DonutChartProps) {
    const series = data.map(item => item.total ?? 0);
    const labels = data.map(item => item.name);
    const colors = data.map(item => item.color);

    const chartOptions: ApexOptions = {
        chart: { type: 'donut' },
        labels,
        colors,
        dataLabels: { enabled: true },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Geral',
                            formatter: () => series.reduce((a, b) => a + b, 0).toString(),
                        },
                    },
                },
            },
        },
        legend: { show: false },
    };

    return (
        <Box className="w-full h-[520px] flex flex-col items-center gap-5 bg-white p-5 rounded-lg ">
            <ReactApexChart
                options={chartOptions}
                series={series}
                type="donut"
                width={380}
            />

            <Box className="flex flex-row gap-5 flex-wrap justify-center">
                {data.map((item, index) => (
                    <Box key={index} className="flex flex-col items-center justify-center gap-2">
                        <Box style={{ color: item.color }} className="text-[.8rem] font-semibold text-center">{item.name}</Box>
                        <Box className="text-[1.5rem] text-[#5E5873] font-semibold">{item.total ?? 0}</Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
