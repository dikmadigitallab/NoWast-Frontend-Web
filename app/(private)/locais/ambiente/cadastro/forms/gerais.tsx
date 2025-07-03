
import { Controller } from "react-hook-form";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";

export default function FormDadosGerais({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

    const localOptions = [
        "Almoxarifado",
        "Obra 1 - Centro",
        "Obra 2 - Zona Norte",
        "Oficina",
        "Depósito"
    ];

    return (
        <Box className="w-full flex flex-col gap-5">
            <Box className="w-full flex flex-row justify-between ">
                <Controller
                    name="id"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="ID#"
                            {...field}
                            error={!!errors.id}
                            helperText={errors.id?.message}
                            className="w-[10%]"
                            sx={{
                                ...formTheme,

                            }}
                        />

                    )}
                />
                <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Nome do prédio"
                            {...field}
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            className="w-[79.2%]"
                            sx={formTheme}
                        />

                    )}
                />
                <Controller
                    name="dimenssao"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Dimenssão (M²)"
                            {...field}
                            error={!!errors.dimenssao}
                            helperText={errors.dimenssao?.message}
                            className="w-[10%]"
                            sx={formTheme}
                        />

                    )}
                />
            </Box>
            <Box className="w-full justify-between flex flex-row">
                <Controller
                    name="predio"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Predio"
                            {...field}
                            error={!!errors.predio}
                            helperText={errors.predio?.message}
                            className="w-[49.8%]"
                            sx={formTheme}
                        />

                    )}
                />
                <FormControl sx={formTheme} className="w-[49.8%]" error={!!errors.setor}>
                    <InputLabel>Setor</InputLabel>
                    <Controller
                        name="setor"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Setor"
                                {...field}
                                error={!!errors.setor}
                                className="w-[100%]"
                                sx={formTheme}
                            >
                                {localOptions.map((local) => (
                                    <MenuItem key={local} value={local}>
                                        {local}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.setor && (
                        <p className="text-red-500 text-xs mt-1">{errors.setor.message}</p>
                    )}
                </FormControl>
            </Box>
            <Box>
                <Controller
                    name="descricao"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição"
                            multiline
                            rows={10}
                            {...field}
                            error={!!errors.descricao}
                            helperText={errors.descricao?.message}
                            className="w-[100%]"
                            sx={formTheme}
                        />

                    )}
                />
            </Box>
        </Box>
    )
} 