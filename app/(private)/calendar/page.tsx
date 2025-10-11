'use client';

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, eachDayOfInterval, addMonths, subMonths, addWeeks, subWeeks, addDays as addDay, subDays, isToday, parse } from 'date-fns';
import { filterStatusCalendarActivity } from '@/app/utils/calendarStatus';
import { StyledMainContainer } from '@/app/styles/container/container';
import ModalVisualizeDetail from "./component/ModalVisualizeDetail";
import React, { useState, useMemo, useEffect } from 'react';
import { ptBR } from 'date-fns/locale';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { formTheme } from '@/app/styles/formTheme/theme';
import { useGetActivity } from '@/app/hooks/atividade/get';
import { useGet } from '@/app/hooks/crud/get/useGet';
import { useAuthStore } from '@/app/store/storeApp';

// Definindo tipos para os dados recebidos
interface ApprovalStatus {
    title: string;
    color: string;
}

interface StatusEnum {
    title: string;
    color: string;
}

interface ActivityData {
    id: number;
    environment: string;
    dimension: number;
    supervisor: string;
    manager: string;
    statusEnum: StatusEnum;
    approvalStatus: ApprovalStatus;
    dateTime: string;
}

export default function Calendar() {

    const { data: setor } = useGet({ url: 'sector' });
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({ sectorId: '' });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
    const [atividadeFilters, setAtividadeFilters] = useState({ mes: (new Date().getMonth() + 1).toString().padStart(2, '0'), ano: new Date().getFullYear().toString() });

    // Calcular o período completo que aparece na grade do calendário
    const getCalendarDateRange = (currentDate: Date) => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        
        return {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd')
        };
    };

    const calendarRange = getCalendarDateRange(currentDate);

    const { data: atividades, loading } = useGetActivity({
        disablePagination: true,
        startDate: calendarRange.startDate,
        endDate: calendarRange.endDate,
    });

    // Converter string de Data para objeto Date
    const parseActivityDate = (dateTimeString: string): Date => {
        try {
            const [datePart, timePart] = dateTimeString.split(', ');
            const [day, month, year] = datePart.split('/');
            return parse(`${day}/${month}/${year} ${timePart}`, 'dd/MM/yyyy HH:mm:ss', new Date());
        } catch (error) {
            console.error('Erro ao parsear data:', dateTimeString, error);
            return new Date();
        }
    };

    const filteredActivities = useMemo(() => {
        if (!atividades) return [];

        // Usar o período completo do calendário (incluindo dias dos meses anterior e posterior)
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return atividades.filter((activity: ActivityData) => {
            try {
                const activityDate = parseActivityDate(activity.dateTime);
                return activityDate >= startDate && activityDate <= endDate;
            } catch (error) {
                console.error('Erro ao filtrar atividade:', activity, error);
                return false;
            }
        });
    }, [atividades, currentDate]);

    // Agrupar atividades por data para facilitar o acesso
    const activitiesByDate = useMemo(() => {
        const grouped: Record<string, ActivityData[]> = {};

        filteredActivities.forEach((activity: ActivityData) => {
            try {
                const dateKey = format(parseActivityDate(activity.dateTime), 'yyyy-MM-dd');
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(activity);
            } catch (error) {
                console.error('Erro ao agrupar atividade:', activity, error);
            }
        });

        return grouped;
    }, [filteredActivities]);

    // Navegação no calendário - Corrigido para aguardar a requisição
    const goToPrevious = () => {
        setIsLoading(true);
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
        setAtividadeFilters(prev => ({
            ...prev,
            mes: (newDate.getMonth() + 1).toString().padStart(2, '0'),
            ano: newDate.getFullYear().toString()
        }));
    };

    const goToNext = () => {
        setIsLoading(true);
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
        setAtividadeFilters(prev => ({
            ...prev,
            mes: (newDate.getMonth() + 1).toString().padStart(2, '0'),
            ano: newDate.getFullYear().toString()
        }));
    };

    const goToToday = () => {
        setIsLoading(true);
        const today = new Date();
        setCurrentDate(today);
        setAtividadeFilters({
            mes: (today.getMonth() + 1).toString().padStart(2, '0'),
            ano: today.getFullYear().toString()
        });
    };

    // Resetar loading quando os dados chegarem
    useEffect(() => {
        if (!loading && atividades) {
            setIsLoading(false);
        }
    }, [loading, atividades]);

    // Opções para os selects de mês e ano
    const monthOptions = [
        { value: '01', label: 'Janeiro' },
        { value: '02', label: 'Fevereiro' },
        { value: '03', label: 'Março' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Maio' },
        { value: '06', label: 'Junho' },
        { value: '07', label: 'Julho' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Setembro' },
        { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' },
        { value: '12', label: 'Dezembro' }
    ];

    // Gerar opções de anos (dos últimos 5 anos até o ano atual)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
    }));

    const handleAtividadeFilterChange = (event: any) => {
        const { name, value } = event.target;
        setIsLoading(true);

        // Obter os novos valores baseados na mudança atual
        const newMes = name === 'mes' ? value : atividadeFilters.mes;
        const newAno = name === 'ano' ? value : atividadeFilters.ano;

        setAtividadeFilters(prev => ({
            ...prev,
            [name]: value
        }));

        const newDate = new Date(
            parseInt(newAno),
            parseInt(newMes) - 1,
            1
        );
        setCurrentDate(newDate);
    };

    // Renderizar cabeçalho com controles de navegação
    const renderHeader = () => {
        const dateFormat = "MMMM 'de' yyyy";

        return (
            <Box className="flex items-center justify-between mb-6 p-4 bg-white rounded-[2px] border border-gray-200">
                <Box className="flex items-center space-x-4">
                    <button
                        onClick={goToPrevious}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={goToToday}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#00b288] text-white rounded-md hover:bg-[#00b288] transition-colors disabled:opacity-50"
                    >
                        Hoje
                    </button>

                    <button
                        onClick={goToNext}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 ml-4">
                        {format(currentDate, dateFormat, { locale: ptBR })}
                    </h2>
                </Box>

                <Box className="flex space-x-2">


                    <Box className="flex gap-2">
                        <FormControl sx={formTheme} className="w-[120px]">
                            <InputLabel>Setor</InputLabel>
                            <Select
                                disabled={loading}
                                label="Setor"
                                value={filters.sectorId}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, sectorId: e.target.value }))
                                }
                            >
                                <MenuItem value="" disabled>
                                    Selecione um setor...
                                </MenuItem>
                                {Array?.isArray(setor) &&
                                    setor.map((setor) => (
                                        <MenuItem key={setor?.id} value={setor?.id}>
                                            {setor?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={formTheme} className="w-[120px]">
                            <InputLabel>Mês</InputLabel>
                            <Select
                                name="mes"
                                value={atividadeFilters.mes}
                                label="Mês"
                                onChange={handleAtividadeFilterChange}
                                disabled={isLoading}
                            >
                                {monthOptions.map(month => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={formTheme} className="w-[120px]">
                            <InputLabel>Ano</InputLabel>
                            <Select
                                name="ano"
                                value={atividadeFilters.ano}
                                label="Ano"
                                onChange={handleAtividadeFilterChange}
                                disabled={isLoading}
                            >
                                {yearOptions.map(year => (
                                    <MenuItem key={year.value} value={year.value}>
                                        {year.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        );
    };

    // Renderizar dias da semana
    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEEEE";
        const startDate = startOfWeek(currentDate);

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            days.push(
                <Box
                    key={i}
                    className="text-center py-2 font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
                >
                    {format(day, dateFormat, { locale: ptBR })}
                </Box>
            );
        }

        return <Box className="grid grid-cols-7 mb-2">{days}</Box>;
    };

    // Renderizar células do mês
    const renderCells = () => {
        if (isLoading) {
            return (
                <Box className="flex justify-center items-center h-64">
                    <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b288]"></Box>
                </Box>
            );
        }

        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                const dateKey = format(cloneDay, 'yyyy-MM-dd');
                const dayActivities = activitiesByDate[dateKey] || [];

                days.push(
                    <Box
                        key={day.toString()}
                        className={`min-h-[170px] p-2 border border-gray-200 ${!isSameMonth(day, monthStart) ? 'bg-gray-200/65 text-gray-800' : ''
                            } ${isToday(day) ? 'bg-blue-50' : ''}`}
                    >
                        <Box className="flex justify-between">
                            <span className={`text-md font-bold ${isToday(day) 
                                ? 'bg-[#00b288] text-white rounded-full w-8 h-8 flex items-center justify-center' 
                                : !isSameMonth(day, monthStart) 
                                    ? 'text-gray-500 font-semibold' 
                                    : 'text-gray-800 font-bold'
                            }`}>
                                {formattedDate}
                            </span>
                            {dayActivities.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                    {dayActivities.length}
                                </span>
                            )}
                        </Box>
                        <Box className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                            {dayActivities.slice(0, 100).map(activity => (
                                <Box
                                    key={activity.id}
                                    className={`text-xs p-1 rounded-[5px] border cursor-pointer ${filterStatusCalendarActivity(activity.approvalStatus.title).color || filterStatusCalendarActivity('DEFAULT').color}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedActivity(activity);
                                    }}
                                >
                                    <Box className="font-semibold truncate">
                                        {activity.environment}
                                    </Box>
                                    <Box className="text-[10px] opacity-75">
                                        {format(parseActivityDate(activity.dateTime), 'HH:mm')}
                                    </Box>
                                </Box>
                            ))}
                            {dayActivities.length > 100 && (
                                <Box className="text-xs text-blue-500 text-center py-1">
                                    +{dayActivities.length - 100} mais
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
                day = addDays(day, 1);
            }
            rows.push(<Box key={day.toString()} className="grid grid-cols-7">{days}</Box>);
            days = [];
        }
        return <Box className="calendar-body">{rows}</Box>;
    };

    return (
        <StyledMainContainer>
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            <ModalVisualizeDetail
                modalVisualize={selectedActivity}
                handleChangeModalVisualize={setSelectedActivity}
            />
        </StyledMainContainer>
    );
};