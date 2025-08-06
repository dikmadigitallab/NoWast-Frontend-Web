'use client';

import { Controller } from "react-hook-form";
import { formTheme } from "@/app/styles/formTheme/theme";
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useGet } from "@/app/hooks/crud/get/useGet";

export default function FormJustificativa({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

    const { data: pessoas, loading } = useGet({ url: "person" });

    return (
        <Box className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <Box className="text-lg font-medium mb-4 text-[#5E5873] flex flex-row items-center gap-2">Justificativa <Box className="text-xs text-[#0ac5b2]">(Opcional)</Box></Box>

            <Controller
                name="justification.reason"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Motivo"
                        {...field}
                        error={!!errors.justification?.reason}
                        helperText={errors.justification?.reason?.message}
                        className="w-[100%] mb-4"
                        sx={formTheme}
                    />
                )}
            />

            <Controller
                name="justification.description"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Descrição"
                        multiline
                        rows={3}
                        {...field}
                        error={!!errors.justification?.description}
                        helperText={errors.justification?.description?.message}
                        className="w-[100%] mb-4"
                        sx={formTheme}
                    />
                )}
            />

            <Box className="flex gap-4">

                <Controller
                    name="justification.justifiedByUserId"
                    control={control}
                    render={({ field }) => {
                        const justifiedByUserId = field.value || "";
                        return (
                            <FormControl sx={formTheme} fullWidth error={!!errors.justification?.justifiedByUserId}>
                                <InputLabel>Justificado Por</InputLabel>
                                <Select
                                    label="Justificado Por"
                                    {...field}
                                    value={justifiedByUserId}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Selecione um gerente...</MenuItem>
                                    {Array?.isArray(pessoas) && pessoas.map((pessoa) => (
                                        <MenuItem key={pessoa?.id} value={pessoa?.id}>
                                            {pessoa?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {loading && (<CircularProgress className='absolute right-2 top-5 bg-white' color="inherit" size={20} />)}
                                <FormHelperText>{errors.justification?.justifiedByUserId?.message}</FormHelperText>
                            </FormControl>
                        )
                    }}
                />

                <Controller
                    name="justification.isInternal"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>É interno?</InputLabel>
                            <Select
                                label="É interno?"
                                {...field}
                                error={!!errors.justification?.isInternal}
                            >
                                <MenuItem value="true">Sim</MenuItem>
                                <MenuItem value="false">Não</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>

            <Controller
                name="justification.transcription"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Transcrição"
                        multiline
                        rows={3}
                        {...field}
                        error={!!errors.justification?.transcription}
                        helperText={errors.justification?.transcription?.message}
                        className="w-[100%] mt-4"
                        sx={formTheme}
                    />
                )}
            />


        </Box>
    );
}