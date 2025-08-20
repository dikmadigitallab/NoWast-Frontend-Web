'use client';

import { Controller } from "react-hook-form";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetIDStore } from "@/app/store/getIDStore";
import { formTheme } from "@/app/styles/formTheme/theme";
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export default function FormDadosGerais({ control, watch, formState: { errors } }: { control: any, watch: any, formState: { errors: any, } }) {

    const { setId } = useGetIDStore();
    const { data: ambientes } = useGet({ url: "environment" });

    return (
        <Box className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <Box className="flex flex-row gap-2">

                <Controller
                    name="environmentId"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth error={!!errors.environmentId}>
                            <InputLabel id="ambiente-label">Ambiente</InputLabel>
                            <Select
                                label="Ambiente"
                                {...field}
                                value={field.value || ""}
                                error={!!errors.environmentId}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    field.onChange(e.target.value)
                                }}
                            >
                                {ambientes?.map((ambiente: any) => (
                                    <MenuItem key={ambiente.id} value={ambiente.id}>
                                        {ambiente.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.environmentId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.environmentId.message}
                                </p>
                            )}
                        </FormControl>
                    )}
                />

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
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            onChange={(event) => field.onChange(new Date(event.target.value).toISOString())}
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

            </Box>

            <Box className="flex flex-row gap-2">

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
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            onChange={(event) => field.onChange(new Date(event.target.value).toISOString())}
                        />
                    )}
                />

                <Controller
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

                <Controller
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
                                <MenuItem value="REJECTED">Rejeitado</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.approvalStatus}>
                                {errors.approvalStatus?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />
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