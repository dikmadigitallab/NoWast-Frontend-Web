import { Controller, useForm } from "react-hook-form";
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useCreateEmpresa } from "@/app/hooks/empresa/create";
import { useGetEmpresa } from "@/app/hooks/empresa/get";
import { useGetPessoa } from "@/app/hooks/pessoas/pessoa/get";

const empresaSchema = z.object({
    acronym: z.string().min(1, "Sigla é obrigatória").max(10, "Sigla muito longa"),
    description: z.string().min(1, "Descrição é obrigatória"),
    person: z.object({ connect: z.object({ id: z.number().int().min(1, "ID da pessoa é obrigatório") }) }),
    businessSector: z.object({
        connect: z.object({
            id: z.number().int().min(1, "ID do setor é obrigatório")
        })
    })
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;


export default function FormEmpresa() {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            acronym: "",
            description: "",
            person: {
                connect: {
                    id: 0
                }
            },
            businessSector: {
                connect: {
                    id: 0
                }
            }
        },
        mode: "onChange"
    });

    const { create, loading } = useCreateEmpresa("company");
    const { data: empresaData } = useGetEmpresa("businessSector");
    const { data: pessoaData } = useGetPessoa();

    const onSubmit = (data: EmpresaFormValues) => {
        create(data);
    };

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Box className="flex flex-col gap-4">
                <Controller
                    name="acronym"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Sigla"
                            {...field}
                            error={!!errors.acronym}
                            helperText={errors.acronym?.message}
                            className="w-full"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição"
                            {...field}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            className="w-full"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="person.connect.id"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.person?.connect?.id}>
                            <InputLabel id="pessoa-label">Pessoa</InputLabel>
                            <Select
                                labelId="pessoa-label"
                                label="Pessoa"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                sx={formTheme}
                            >
                                <MenuItem value={0} disabled>
                                    Selecione uma pessoa
                                </MenuItem>
                                {pessoaData?.map((user: any) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Box display="flex" justifyContent="space-between" width="100%">
                                            <Box className="flex flex-col">
                                                <span className="text-[#000] text-[1rem]">{user?.name}</span>
                                                <span className="text-gray-600 text-[.8rem]">{user?.tradeName}</span>
                                            </Box>
                                            <span className="text-gray-600 text-xs">CPF/CNPJ: {user?.document}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.person?.connect?.id && (
                                <Typography color="error" variant="caption">
                                    {errors.person.connect.id.message}
                                </Typography>
                            )}
                        </FormControl>
                    )}
                />
                <Controller
                    name="businessSector.connect.id"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.businessSector?.connect?.id}>
                            <InputLabel id="business-sector-label">Setor de Negócios</InputLabel>
                            <Select
                                labelId="business-sector-label"
                                label="Setor de Negócios"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                sx={formTheme}
                            >
                                <MenuItem value={0} disabled>
                                    Selecione um setor
                                </MenuItem>
                                {empresaData?.map((setor: any) => (
                                    <MenuItem key={setor.id} value={setor.id}>
                                        {setor.description}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.businessSector?.connect?.id && (
                                <Typography color="error" variant="caption">
                                    {errors.businessSector.connect.id.message}
                                </Typography>
                            )}
                        </FormControl>
                    )}
                />
                <Button
                    disabled={loading}
                    variant="contained"
                    type="submit"
                    sx={[buttonTheme, { width: "100%" }]}
                >
                    Salvar
                </Button>
            </Box>
        </form>
    );
}

