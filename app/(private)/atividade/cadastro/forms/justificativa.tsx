'use client';

import { Controller } from "react-hook-form";
import { formTheme } from "@/app/styles/formTheme/theme";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export default function FormJustificativa({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

    return (
        <Box className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <h3 className="text-lg font-medium mb-4 text-[#5E5873]">Justificativa</h3>

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
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="ID do Justificador"
                            type="number"
                            {...field}
                            error={!!errors.justification?.justifiedByUserId}
                            helperText={errors.justification?.justifiedByUserId?.message}
                            fullWidth
                            sx={formTheme}
                        />
                    )}
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