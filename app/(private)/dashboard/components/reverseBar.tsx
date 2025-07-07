import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartDataProps = {
    data: number[];
    categories: string[];
    color: string;
};

type ReverseBarProps = {
    chart: ChartDataProps;
};

export default function ReverceChart({ chart }: ReverseBarProps) {
    const [chartData] = useState({
        series: [{
            data: chart.data
        }],
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
                    colors: {
                        ranges: [{
                            from: 0,
                            to: Math.max(...chart.data, 1500),
                            color: chart.color
                        }]
                    }
                }
            },
            dataLabels: {
                enabled: false
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
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '1rem',
                    }
                }
            },
            xaxis: {
                categories: chart.categories,
                labels: {
                    style: {
                        fontSize: '1rem',
                    }
                }
            }
        } as ApexOptions
    });

    return (
        <ReactApexChart
            className="w-full"
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={550}
        />
    );
}

