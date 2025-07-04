'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ColumnChart() {
   
    const [chartData] = React.useState<{ series: Array<{ name: string, data: number[] }>; options: ApexOptions }>({
        series: [
            {
                name: 'Ocorrências',
                data: [55, 58, 32, 70, 25, 100, 70, 63, 62, 11, 29, 37, 44, 122, 45, 67, 89, 23, 56, 78, 90, 21, 43, 65, 87, 32, 54, 76, 98, 12, 34]
            }
        ],
        options: {
            chart: {
                type: 'bar' as const,
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                    borderRadiusApplication: 'end'
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['#08bdb4']
            },
            xaxis: {
                categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    style: {
                        fontSize: '14px',
                        fontWeight: 600,
                        colors: ['#000']
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Ocorrências',
                    style: {
                        color: '#08bdb4',
                        fontSize: '16px',
                        fontWeight: 600
                    }
                },
                labels: {
                    style: {
                        colors: ['#000'],
                        fontSize: '14px',
                        fontWeight: 600
                    }
                }
            },
            fill: {
                opacity: 1,
                colors: ['#08bdb4']
            },
            tooltip: {
                theme: 'dark',
                style: {
                    fontSize: '16px',
                },
                y: {
                    formatter: function (val: number) {
                        return val + " ocorrências";
                    }
                }
            }
        }
    });

    return (
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={550} />
    );
};

