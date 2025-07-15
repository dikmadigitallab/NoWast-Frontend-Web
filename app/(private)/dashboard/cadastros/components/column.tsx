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
            type: 'column'
        }, {
            name: 'Início',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            type: 'area'
        }, {
            name: 'Fim',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
            type: 'line'
        }],
        options: {
            chart: {
                type: 'line',
                height: 350,
                stacked: false
            },
            stroke: {
                width: [0, 2, 5],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            fill: {
                opacity: [0.85, 0.25, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: ['04/03/2025', '05/03/2025', '06/03/2025', '07/03/2025', '08/03/2025', '09/03/2025', '10/03/2025', '11/03/2025', '12/03/2025'],
            markers: {
                size: 0
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                title: {
                    text: 'Início e Fim de Contrato'
                },
                min: 0
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y: number) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + " ocorrências";
                        }
                        return y;
                    }
                }
            }
        },

    });


    return (
        <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
    );
}

export default CadastroColumnChart;

