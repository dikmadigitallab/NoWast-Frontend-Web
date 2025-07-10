import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';
import { MdOutlineChecklist } from 'react-icons/md';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartItem = {
    name: string;
    data: number[];
    color: string;
    total: number;
};

type DonutChartProps = {
    data: ChartItem[];
};

export default function DonutsRow({ data }: DonutChartProps) {

    const series = data.map(item => item.total);
    const labels = data.map(item => item.name);
    const colors = data.map(item => item.color);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels,
        colors,
        dataLabels: {
            enabled: true,
        },
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
        legend: {
            show: false
        },
    };

    return (
        <Box className="flex flex-col items-center gap-5">
            <ReactApexChart
                options={chartOptions}
                series={series}
                type="donut"
                width={380}
            />

            <Box className="flex flex-row gap-5 mt-5">
                {data.map((item, index) => (
                    <Box key={index} className="flex flex-col items-center gap-2">
                        <Box style={{ color: item.color }} className="text-[1rem] font-semibold">{item.name}</Box>
                        <Box className="text-[1.5rem] text-[#5E5873] font-semibold">{item.total}</Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}