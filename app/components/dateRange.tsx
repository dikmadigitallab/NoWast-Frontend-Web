'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

// importa locale do dayjs
import 'dayjs/locale/pt-br';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export default function BasicDateRangePicker({ startDate, endDate, onChange }: Props) {
  const [start, setStart] = React.useState<Dayjs | null>(
    startDate ? dayjs(startDate) : null
  );
  const [end, setEnd] = React.useState<Dayjs | null>(
    endDate ? dayjs(endDate) : null
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DatePicker
          label="Data Início"
          value={start}
          onChange={(newValue) => {
            setStart(newValue);
            onChange(
              newValue ? newValue.format('YYYY-MM-DD') : '',
              end ? end.format('YYYY-MM-DD') : ''
            );
          }}
          slotProps={{
            textField: {
              sx: { width: "45%", height: "100%" },
            },
          }}
        />
        <Box sx={{ mx: 1 }}>até</Box>
        <DatePicker
          label="Data Fim"
          value={end}
          onChange={(newValue) => {
            setEnd(newValue);
            onChange(
              start ? start.format('YYYY-MM-DD') : '',
              newValue ? newValue.format('YYYY-MM-DD') : ''
            );
          }}
          slotProps={{
            textField: {
              sx: { width: "45%", height: "100%" },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
