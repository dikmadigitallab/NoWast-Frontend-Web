"use client";

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Box, CircularProgress, Fade, ClickAwayListener, Chip } from '@mui/material';
import { formTheme } from '@/app/styles/formTheme/theme';
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from 'react-icons/io';

interface Option {
    id: number | string;
    name: string;
    [key: string]: any;
}

interface CustomAutocompleteProps {
    options: Option[];
    value?: Option | null;
    onChange?: (value: Option | null) => void;
    onInputChange: (value: string) => void;
    loading?: boolean;
    label: string;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    getOptionLabel?: (option: Option) => string;
    noOptionsText?: string;
    loadingText?: string;
    multiple?: boolean;
    multipleValue?: Option[];
    onMultipleChange?: (values: Option[]) => void;
}

export default function CustomAutocomplete({
    options = [],
    value,
    onChange,
    onInputChange,
    loading = false,
    label,
    error = false,
    helperText,
    placeholder,
    disabled = false,
    className = "",
    getOptionLabel = (option) => option.name || '',
    noOptionsText = "Nenhuma opção encontrada",
    loadingText = "Carregando...",
    multiple = false,
    multipleValue = [],
    onMultipleChange
}: CustomAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Atualiza o valor do input quando o valor selecionado muda (apenas quando não está digitando)
    useEffect(() => {
        // Só limpa o input se não há valor selecionado e não está digitando
        if (!isTyping && !isOpen && !value && !multiple) {
            setInputValue('');
        }
    }, [value, getOptionLabel, multiple, isTyping, isOpen]);

    // Atualiza o valor do input para múltipla seleção (apenas quando não está digitando)
    useEffect(() => {
        // Só limpa o input se não há valores selecionados e não está digitando
        if (!isTyping && !isOpen && multiple && (!multipleValue || multipleValue.length === 0)) {
            setInputValue('');
        }
    }, [multipleValue, getOptionLabel, multiple, isTyping, isOpen]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        setHighlightedIndex(-1);
        setIsTyping(true);
        
        // Chama a função de busca na API
        onInputChange(newValue);
        
        // Abre o dropdown quando o usuário digita
        if (!isOpen) {
            setIsOpen(true);
        }

        // Reset do estado de digitação após um tempo
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const handleInputClick = () => {
        setIsOpen(true);
    };

    const handleClearSelection = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsTyping(false);
        setInputValue('');
        onChange?.(null);
        if (multiple && onMultipleChange) {
            onMultipleChange([]);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleInputBlur = () => {
        // Delay para permitir cliques nas opções
        setTimeout(() => {
            if (isOpen) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        }, 200);
    };

    const handleOptionClick = (option: Option) => {
        setIsTyping(false);
        if (multiple && onMultipleChange) {
            const isSelected = multipleValue.some(v => v.id === option.id);
            if (isSelected) {
                onMultipleChange(multipleValue.filter(v => v.id !== option.id));
            } else {
                onMultipleChange([...multipleValue, option]);
            }
            // Para seleção múltipla, mantém o texto de busca
            // setInputValue(''); // Removido para manter o texto
        } else {
            onChange?.(option);
            setIsOpen(false);
            // Para seleção única, mantém o texto de busca
            // setInputValue(''); // Removido para manter o texto
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isOpen) {
            if (event.key === 'ArrowDown' || event.key === 'Enter') {
                setIsOpen(true);
                return;
            }
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setHighlightedIndex(prev => 
                    prev < options.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : options.length - 1
                );
                break;
            case 'Enter':
                event.preventDefault();
                if (highlightedIndex >= 0 && options[highlightedIndex]) {
                    handleOptionClick(options[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    const isOptionSelected = (option: Option) => {
        if (multiple) {
            return multipleValue.some(v => v.id === option.id);
        }
        return value?.id === option.id;
    };

    const renderOptions = () => {
        if (loading) {
            return (
                <Box className="flex items-center justify-center p-4">
                    <CircularProgress size={20} color="inherit" />
                    <span className="ml-2 text-black">{loadingText}</span>
                </Box>
            );
        }

        if (options.length === 0) {
            return (
                <Box className="p-4 text-center text-black">
                    {noOptionsText}
                </Box>
            );
        }

        return options.map((option, index) => (
            <Box
                key={option.id}
                className={`
                    px-4 py-3 cursor-pointer transition-colors duration-150 text-black
                    ${highlightedIndex === index ? 'bg-[#3aba8a] text-white' : 'hover:bg-gray-100'}
                    ${isOptionSelected(option) ? 'bg-[#3aba8a] text-white' : ''}
                `}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
            >
                {getOptionLabel(option)}
            </Box>
        ));
    };

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <Box className={`relative ${className}`}>
                <TextField
                    ref={inputRef}
                    fullWidth
                    label={label}
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    error={error}
                    helperText={helperText}
                    placeholder={
                        multiple 
                            ? (multipleValue && multipleValue.length > 0 ? "" : placeholder || "Digite para buscar...")
                            : (value ? "" : placeholder || "Digite para buscar...")
                    }
                    disabled={disabled}
                    sx={formTheme}
                    InputProps={{
                        startAdornment: multiple && multipleValue && multipleValue.length > 0 ? (
                            <Box className="flex flex-wrap gap-1 mr-2">
                                {multipleValue.map((item) => (
                                    <Chip
                                        key={item.id}
                                        label={getOptionLabel(item)}
                                        size="small"
                                        onDelete={() => {
                                            const newValues = multipleValue.filter(v => v.id !== item.id);
                                            onMultipleChange?.(newValues);
                                        }}
                                        sx={{
                                            backgroundColor: '#3aba8a',
                                            color: 'white',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#2a9d7a',
                                                transform: 'scale(1.02)'
                                            },
                                            '& .MuiChip-deleteIcon': {
                                                color: 'white',
                                                '&:hover': {
                                                    color: '#e0e0e0'
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : !multiple && value ? (
                            <Box className="flex items-center mr-2">
                                <Chip
                                    label={getOptionLabel(value)}
                                    size="medium"
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        color: '#000000',
                                        padding: '12px 0px',
                                        fontSize: '16px',
                                        height: '36px',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: '#2a9d7a',
                                            color: 'white',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                />
                            </Box>
                        ) : null,
                        endAdornment: (
                            <Box className="flex items-center">
                                {loading && (
                                    <CircularProgress 
                                        size={20} 
                                        color="inherit" 
                                        className="mr-2" 
                                    />
                                )}
                                {!multiple && value && !isTyping && (
                                    <Box 
                                        className="mr-2 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-all duration-200 hover:scale-110"
                                        onClick={handleClearSelection}
                                        title="Limpar seleção"
                                    >
                                        <IoMdClose className="text-gray-500 hover:text-red-500 transition-colors duration-200" size={16} />
                                    </Box>
                                )}
                                {isOpen ? (
                                    <IoIosArrowUp className="text-gray-400" />
                                ) : (
                                    <IoIosArrowDown className="text-gray-400" />
                                )}
                            </Box>
                        ),
                    }}
                />

                <Fade in={isOpen}>
                    <Box
                        ref={listRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#c1c1c1',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#a8a8a8',
                            },
                        }}
                    >
                        {renderOptions()}
                    </Box>
                </Fade>
            </Box>
        </ClickAwayListener>
    );
}
