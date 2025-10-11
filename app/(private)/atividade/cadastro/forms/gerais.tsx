'use client';

import { Controller } from "react-hook-form";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { formTheme } from "@/app/styles/formTheme/theme";
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useDebounce } from "@/app/utils/useDebounce";
import { formatDateTimeLocalFromISO } from "@/app/utils/formateDate";
import { useState } from "react";

export default function FormDadosGerais({ control, watch, formState: { errors } }: { control: any, watch: any, formState: { errors: any, } }) {

    const { setId } = useGetIDStore();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const { data: ambientesRaw, loading } = useGet({
        url: "environment",
        query: debouncedSearchQuery,
        disablePagination: false,
        pageSize: 25,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const ambientes = ambientesRaw ? ambientesRaw.filter((ambiente: any, index: number, self: any[]) =>
        index === self.findIndex((a: any) => a.id === ambiente.id)
    ) : [];

    return (
        <Box className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <Box className="flex flex-row gap-2">

                <Controller
                    name="environmentId"
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete
                            options={ambientes || []}
                            getOptionLabel={(option: any) => option.name || ''}
                            value={ambientes?.find((ambiente: any) => ambiente.id === field.value) || null}
                            loading={loading}
                            onInputChange={(newInputValue) => {
                                setSearchQuery(newInputValue);
                            }}
                            onChange={(newValue) => {
                                const value = newValue?.id || '';
                                field.onChange(value);
                                setId(value);
                            }}
                            label="Ambiente"
                            error={!!errors.environmentId}
                            helperText={errors.environmentId?.message}
                            noOptionsText="Nenhum ambiente encontrado"
                            loadingText="Carregando ambientes..."
                            className="w-full"
                        />
                    )}
                />


                <Controller
                    name="dateTime"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Data e hora de Início da atividade"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.dateTime}
                            helperText={errors.dateTime?.message}
                            fullWidth
                            sx={formTheme}
                            value={field.value ? formatDateTimeLocalFromISO(field.value) : ""}
                            onChange={(event) => {
                                field.onChange(event.target.value);
                            }}
                        />
                    )}
                />


                <Controller
                    name="activityTypeEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth>
                            <InputLabel>Tipo de Atividade</InputLabel>
                            <Select
                                label="Tipo de Atividade"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.activityTypeEnum}>
                                <MenuItem value="NORMAL">Normal</MenuItem>
                                <MenuItem value="URGENT">Urgente</MenuItem>
                                <MenuItem value="RECURRING">Recorrente</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.activityTypeEnum}>
                                {errors.activityTypeEnum?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

            </Box>

            <Box className="flex flex-row gap-2">

                <Controller
                    name="hasRecurrence"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Atividade Recorrente</InputLabel>
                            <Select label="Atividade Recorrente" {...field} error={!!errors.hasRecurrence}>
                                <MenuItem value="true">Sim</MenuItem>
                                <MenuItem value="false">Não</MenuItem>
                            </Select>
                            {errors.hasRecurrence && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.hasRecurrence.message}
                                </p>
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="recurrenceFinalDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            disabled={watch("hasRecurrence") === "true" ? false : true}
                            variant="outlined"
                            label="Data e hora do fim da recorrência"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.recurrenceFinalDate}
                            helperText={errors.recurrenceFinalDate?.message}
                            fullWidth
                            sx={formTheme}
                            value={field.value ? formatDateTimeLocalFromISO(field.value) : ""}
                            onChange={(event) => {
                                field.onChange(event.target.value);
                            }}
                        />
                    )}
                />

                <Controller
                    name="recurrenceType"
                    control={control}
                    disabled={watch("hasRecurrence") === "true" ? false : true}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Tipo de recorrência</InputLabel>
                            <Select label="Tipo de recorrência" {...field} error={!!errors.recurrenceType}>
                                <MenuItem value="DAILY">Diaria</MenuItem>
                                <MenuItem value="WEEKLY">Semanal</MenuItem>
                                <MenuItem value="MONTHLY">Mensal</MenuItem>
                                <MenuItem value="YEARLY">Anual</MenuItem>
                            </Select>
                            {errors.recurrenceType && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.recurrenceType.message}
                                </p>
                            )}
                        </FormControl>
                    )}
                />

                {/* <Controller
                    name="statusEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.statusEnum}
                            >
                                <MenuItem value="OPEN">Aberto</MenuItem>
                                <MenuItem value="COMPLETED">Concluído</MenuItem>
                                <MenuItem value="UNDER_REVIEW">Em Revisão</MenuItem>
                                <MenuItem value="PENDING">Pendente</MenuItem>
                                <MenuItem value="JUSTIFIED">Justificado</MenuItem>
                                <MenuItem value="INTERNAL_JUSTIFICATION">Justificativa Interna</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.statusEnum}>
                                {errors.statusEnum?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                /> */}


                {/* <Controller
                    name="approvalStatus"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth>
                            <InputLabel>Status de aprovação da atividade</InputLabel>
                            <Select
                                label="Status de aprovação da atividade"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.approvalStatus}
                            >
                                <MenuItem value="PENDING">Pendente</MenuItem>
                                <MenuItem value="APPROVED">Aprovado</MenuItem>
                                <MenuItem value="REJECTED">Reprovado</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.approvalStatus}>
                                {errors.approvalStatus?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                /> */}
            </Box>

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Observações"
                        multiline
                        rows={3}
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        sx={formTheme}
                    />
                )}
            />

        </Box>
    );
}