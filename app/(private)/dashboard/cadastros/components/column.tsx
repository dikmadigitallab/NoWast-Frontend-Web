import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CadastroColumnChart = () => {
    const [state, setState] = React.useState<{
        series: ApexAxisChartSeries;
        options: ApexOptions;
    }>({
        series: [{
            name: 'Pessoas',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            color: '#2196F3'
        }, {
            name: 'Início',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            color: '#4CAF50'
        }, {
            name: 'Fim',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
            color: '#FF9800'
        }],
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
            },
            xaxis: {
                categories: ['04/03/2025', '05/03/2025', '06/03/2025', '07/03/2025', '08/03/2025', '09/03/2025', '10/03/2025', '11/03/2025', '12/03/2025'],
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
                    text: 'Início e Fim de Contrato',
                    style: {
                        color: '#5E5873',
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
                opacity: 1
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
        },

    });

    return (
        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
    );
}

export default CadastroColumnChart;

