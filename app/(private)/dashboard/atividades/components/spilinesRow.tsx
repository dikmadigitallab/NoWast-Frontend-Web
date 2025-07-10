'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/material';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartItem = {
  name: string;
  data: number[];
  color: string;
  icon?: any;
};

type SpilinesRowProps = {
  data: ChartItem[];
};

export default function SpilinesRow({ data }: SpilinesRowProps) {

  const [chartData] = useState(
    data.map((item: any) => ({
      icon: item.icon,
      series: [
        {
          name: item.name,
          data: item.data,
          color: item.color,
        },
      ],
      options: {
        chart: { height: 100, type: 'area' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
      } as ApexOptions,
    }))
  );

  return (
    <>
      {chartData.map((data: any, index: any) => (
        <Box key={index} className="flex flex-col justify-between w-[25%] h-[160px] bg-[#fff] rounded-lg relative overflow-hidden">
          <Box className="flex flex-row items-center gap-3 mt-5 ml-5">
            <Box
              style={{ background: `${data.series[0]?.color}` }} className={`p-3 rounded-full`}>
              {data.icon}
            </Box>
            <Box className="flex flex-col ">
              <span className='text-[#5E5873] text-[1.5rem] font-bold'>925</span>
              <span className='text-[#5E5873] text-[1.1rem] font-normal mt-[-5px]'>Total</span>
            </Box>
          </Box>

          <Box className="absolute bottom-[-20px] left-[-20px] w-[110%] h-[100px] rounded-b-lg ">
            <ReactApexChart
              options={{
                ...data.options,
                chart: {
                  ...data.options.chart,
                  toolbar: {
                    show: false,
                  },
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
                xaxis: {
                  labels: {
                    show: false,
                  },
                  axisTicks: {
                    show: false,
                  },
                  axisBorder: {
                    show: false,
                  },
                },
                yaxis: {
                  show: false,
                },
                grid: {
                  show: false,
                },
              }}
              series={data.series}
              type="area"
              height={100}
            />
          </Box>
        </Box>
      ))}
    </>
  );
};