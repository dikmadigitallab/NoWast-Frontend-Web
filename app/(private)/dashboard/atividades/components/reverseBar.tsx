import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ReverseBar() {

    const [chartData] = React.useState<{series: ApexAxisChartSeries;options: ApexOptions}>({
        series: [{
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
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
                            to: 1500,
                            color: '#29C770'
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
                        return val + "Justificativas";
                    }
                }
            },
            xaxis: {
                categories: ['Falta', 'Atestado', 'Falta de máquina', 'Mudança de prioridade cliente', 'Mudança de prioridade dikma', 'Quebra', 'Manutenção', 'Outro']
            }
        },
    });

    return (
        <Box className="w-full h-full">
            <Box id="chart" className="w-full h-full">
                <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={550} />
            </Box>
        </Box>
    );
}

