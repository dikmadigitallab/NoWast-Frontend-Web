'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ColumnChart() {

    const daysInMonth = Array.from({ length: 31 }, (_, i) => `${String(i + 1).padStart(2, '0')}/07`);

    const [chartData] = React.useState<{
        series: Array<{ name: string; data: number[] }>;
        options: ApexOptions;
    }>({
        series: [
            {
                name: 'Grave',
                data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 10))
            },
            {
                name: 'Leve',
                data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 20))
            },
            {
                name: 'Nenhum',
                data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 30))
            }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: { show: true },
                zoom: { enabled: true }
            },
            colors: ['#EA5455', '#FDE802', '#768B95'],
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
                categories: daysInMonth,
                labels: {
                    rotate: -45,
                    hideOverlappingLabels: true
                }
            },
            legend: {
                position: 'bottom',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        }
    });

    return (
        <ReactApexChart
            type="bar"
            height={550}
            series={chartData.series}
            options={chartData.options}
        />
    );
}
