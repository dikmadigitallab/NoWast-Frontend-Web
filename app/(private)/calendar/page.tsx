'use client';

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, eachDayOfInterval, addMonths, subMonths, addWeeks, subWeeks, addDays as addDay, subDays, isToday, parse } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { ptBR } from 'date-fns/locale';
import { Box } from '@mui/material';
import ModalVisualizeDetail from "./component/ModalVisualizeDetail";
import { Data } from './data';
import { StyledMainContainer } from '@/app/styles/container/container';

// Definindo tipos para os dados recebidos
interface ApprovalStatus {
    title: string;
    color: string;
}

interface ActivityData {
    id: number;
    environment: string;
    dimension: number;
    supervisor: string;
    manager: string;
    approvalStatus: ApprovalStatus;
    dateTime: string;
}

// Mapeamento de cores para status baseado nos dados recebidos
const statusColors: Record<string, string> = {
    'Aprovado': 'bg-green-100 border-green-500 text-green-800',
    'Pendente': 'bg-yellow-100 border-yellow-500 text-yellow-800',
    'Recusado': 'bg-red-100 border-red-500 text-red-800',
    'DEFAULT': 'bg-gray-100 border-gray-300 text-gray-600'
};

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    // Converter string de Data para objeto Date
    const parseActivityDate = (dateTimeString: string): Date => {
        // Formato: "DD/MM/YYYY, HH:mm:ss"
        const [datePart, timePart] = dateTimeString.split(', ');
        const [day, month, year] = datePart.split('/');
        return parse(`${day}/${month}/${year} ${timePart}`, 'dd/MM/yyyy HH:mm:ss', new Date());
    };

    const filteredActivities = useMemo(() => {
        if (view === 'day') {
            return Data.filter(activity =>
                isSameDay(parseActivityDate(activity.dateTime), currentDate)
            );
        } else if (view === 'week') {
            const weekStart = startOfWeek(currentDate);
            const weekEnd = endOfWeek(currentDate);
            return Data.filter(activity => {
                const activityDate = parseActivityDate(activity.dateTime);
                return activityDate >= weekStart && activityDate <= weekEnd;
            });
        } else {
            // Vista mensal - filtrar atividades do mês atual
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(currentDate);
            return Data.filter(activity => {
                const activityDate = parseActivityDate(activity.dateTime);
                return activityDate >= monthStart && activityDate <= monthEnd;
            });
        }
    }, [currentDate, view]);

    // Agrupar atividades por data para facilitar o acesso
    const activitiesByDate = useMemo(() => {
        const grouped: Record<string, ActivityData[]> = {};

        filteredActivities.forEach(activity => {
            const dateKey = format(parseActivityDate(activity.dateTime), 'yyyy-MM-dd');
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(activity);
        });

        return grouped;
    }, [filteredActivities]);

    // Navegação no calendário
    const goToPrevious = () => {
        if (view === 'day') {
            setCurrentDate(prev => subDays(prev, 1));
        } else if (view === 'week') {
            setCurrentDate(prev => subWeeks(prev, 1));
        } else {
            setCurrentDate(prev => subMonths(prev, 1));
        }
    };

    const goToNext = () => {
        if (view === 'day') {
            setCurrentDate(prev => addDay(prev, 1));
        } else if (view === 'week') {
            setCurrentDate(prev => addWeeks(prev, 1));
        } else {
            setCurrentDate(prev => addMonths(prev, 1));
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Renderizar cabeçalho com controles de navegação
    const renderHeader = () => {
        let dateFormat = '';

        if (view === 'day') {
            dateFormat = "d 'de' MMMM 'de' yyyy";
        } else if (view === 'week') {
            const weekStart = startOfWeek(currentDate);
            const weekEnd = endOfWeek(currentDate);

            if (isSameMonth(weekStart, weekEnd)) {
                dateFormat = "d 'a' d 'de' MMMM 'de' yyyy";
            } else {
                dateFormat = "d 'de' MMMM 'a' d 'de' MMMM 'de' yyyy";
            }
        } else {
            dateFormat = "MMMM 'de' yyyy";
        }

        return (
            <Box className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
                <Box className="flex items-center space-x-4">
                    <button
                        onClick={goToPrevious}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-[#00b288] text-white rounded-md hover:bg-[#00b288] transition-colors"
                    >
                        Hoje
                    </button>

                    <button
                        onClick={goToNext}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                    <button
                        onClick={() => setView('day')}
                        className={`px-4 py-2 rounded-md transition-colors ${view === 'day' ? 'bg-[#00b288] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Dia
                    </button>
                    <button
                        onClick={() => setView('week')}
                        className={`px-4 py-2 rounded-md transition-colors ${view === 'week' ? 'bg-[#00b288] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setView('month')}
                        className={`px-4 py-2 rounded-md transition-colors ${view === 'month' ? 'bg-[#00b288] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Mês
                    </button>
                </Box>
            </Box>
        );
    };

    // Renderizar dias da semana
    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEEEE"; // Formato abreviado (2 letras)
        const startDate = startOfWeek(currentDate);

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            days.push(
                <Box key={i} className="text-center py-2 font-medium text-gray-600">
                    {format(day, dateFormat, { locale: ptBR })}
                </Box>
            );
        }

        return <Box className="grid grid-cols-7 mb-2">{days}</Box>;
    };

    // Renderizar células do mês com melhor visualização para múltiplas atividades
    const renderCells = () => {
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
                        className={`min-h-[170px] p-2 border border-gray-200 ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : ''
                            } ${isToday(day) ? 'bg-blue-50' : ''}`}
                        onClick={() => dayActivities.length > 0 && setSelectedDay(cloneDay)}
                    >
                        <Box className="flex justify-between">
                            <span className={`text-sm font-medium ${isToday(day) ? 'bg-[#00b288] text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                {formattedDate}
                            </span>
                            {dayActivities.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                    {dayActivities.length}
                                </span>
                            )}
                        </Box>
                        <Box className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                            {dayActivities.slice(0, 4).map(activity => (
                                <Box
                                    key={activity.id}
                                    className={`text-xs p-1 rounded border cursor-pointer ${statusColors[activity.approvalStatus.title] || statusColors.DEFAULT}`}
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
                            {dayActivities.length > 4 && (
                                <Box
                                    className="text-xs text-blue-500 text-center py-1 cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDay(cloneDay);
                                    }}
                                >
                                    +{dayActivities.length - 4} mais
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

    // Renderizar vista de semana
    const renderWeekView = () => {
        const weekStart = startOfWeek(currentDate);
        const days = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) });

        return (
            <Box className="grid grid-cols-7 gap-4">
                {days.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayActivities = activitiesByDate[dateKey] || [];

                    return (
                        <Box
                            key={day.toString()}
                            className={`min-h-32 p-3 rounded-lg border ${isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                            onClick={() => dayActivities.length > 0 && setSelectedDay(day)}
                        >
                            <Box className="font-medium text-center mb-2">
                                <Box className="text-gray-600 text-sm">{format(day, 'EEEE', { locale: ptBR })}</Box>
                                <Box className="flex items-center justify-center">
                                    <Box className={`text-lg ${isToday(day) ? 'text-blue-600 font-bold' : ''}`}>
                                        {format(day, 'd')}
                                    </Box>
                                    {dayActivities.length > 0 && (
                                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-1.5">
                                            {dayActivities.length}
                                        </span>
                                    )}
                                </Box>
                            </Box>

                            <Box className="space-y-2 mt-2">
                                {dayActivities.slice(0, 3).map(activity => (
                                    <Box
                                        key={activity.id}
                                        className={`p-2 rounded text-sm cursor-pointer ${statusColors[activity.approvalStatus.title] || statusColors.DEFAULT
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedActivity(activity);
                                        }}
                                    >
                                        <Box className="font-medium truncate">{activity.environment}</Box>
                                        <Box className="text-xs opacity-75">
                                            {format(parseActivityDate(activity.dateTime), 'HH:mm')}
                                        </Box>
                                    </Box>
                                ))}
                                {dayActivities.length > 3 && (
                                    <Box
                                        className="text-xs text-blue-500 text-center py-1 cursor-pointer hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDay(day);
                                        }}
                                    >
                                        +{dayActivities.length - 3} mais atividades
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    // Renderizar vista de dia
    const renderDayView = () => {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const dayActivities = activitiesByDate[dateKey] || [];

        return (
            <Box className="bg-white rounded-lg shadow p-4">
                <Box className="text-xl font-bold text-center mb-6">
                    {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Box>

                {dayActivities.length === 0 ? (
                    <Box className="text-center text-gray-500 py-8">
                        Nenhuma atividade para este dia
                    </Box>
                ) : (
                    <Box className="space-y-4">
                        {dayActivities.map(activity => (
                            <Box
                                key={activity.id}
                                className={`p-4 rounded-lg border cursor-pointer ${statusColors[activity.approvalStatus.title] || statusColors.DEFAULT
                                    }`}
                                onClick={() => setSelectedActivity(activity)}
                            >
                                <Box className="flex justify-between items-start">
                                    <Box>
                                        <h3 className="font-semibold">{activity.environment}</h3>
                                        <p className="text-sm opacity-75 mt-1">
                                            Dimensão: {activity.dimension}m²
                                        </p>
                                        <p className="text-sm opacity-75 mt-1">
                                            {format(parseActivityDate(activity.dateTime), 'HH:mm')}
                                        </p>
                                    </Box>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                                        {activity.approvalStatus.title}
                                    </span>
                                </Box>
                                <Box className="text-sm mt-2">
                                    <p>Supervisor: {activity.supervisor}</p>
                                    <p>Gerente: {activity.manager}</p>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        );
    };



    return (
        <StyledMainContainer>
            {renderHeader()}

            {view === 'month' && (
                <>
                    {renderDays()}
                    {renderCells()}
                </>
            )}

            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}

            <ModalVisualizeDetail
                modalVisualize={selectedActivity}
                handleChangeModalVisualize={setSelectedActivity}
            />
        </StyledMainContainer>


    );
};