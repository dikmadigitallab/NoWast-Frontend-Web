import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PositionData = {
    positionName: string;
    userCount: number;
};

type Props = {
    data: PositionData[];
};

export default function ReverseBar({ data }: Props) {

    const categories = data?.map((item) => item.positionName) || [];
    const values = data?.map((item) => item.userCount) || [];

    const chartData: { series: ApexAxisChartSeries; options: ApexOptions } = {
        series: [
            {
                name: 'Total de usuários',
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
                        return val + ' pessoas';
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
