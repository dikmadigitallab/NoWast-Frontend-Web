import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

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
        <ReactApexChart
            options={chartOptions}
            series={series}
            type="donut"
            width={380}
        />
    );
}