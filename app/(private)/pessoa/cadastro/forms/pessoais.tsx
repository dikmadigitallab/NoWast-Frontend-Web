import { Controller, useForm } from "react-hook-form";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useCreatePessoa } from "@/app/hooks/pessoas/pessoa/create";

const pessoaSchema = z.object({
    name: z.string().min(1, "Por favor, insira o nome completo ou razão social"),
    email: z.string().email("Por favor, insira um email valido").nullable(),
    phone: z.string().min(7, "Por favor, insira um telefone valido").nullable(),
    tradeName: z.string().min(1, "Por favor, insira o nome fantasia"),
    document: z.string().min(1, "Por favor, insira o CPF ou CNPJ"),
    briefDescription: z.string().max(500, "A descrição não pode ter mais de 500 caracteres"),
    birthDate: z.string().nullable().refine(val => !val || !isNaN(Date.parse(val)), {
        message: "Por favor, insira uma data válida"
    }),
    gender: z.string().nullable().refine(val => !val || ["MALE", "FEMALE", "OUTRO", "PREFIRO_NÃO_INFORMAR"].includes(val), {
        message: "Por favor, selecione um gênero válido"
    }),
    personType: z.string().min(1, "Por favor, selecione o tipo de pessoa").nullable()
});

type UserFormValues = z.infer<typeof pessoaSchema>;


export default function FormPessoas() {

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<UserFormValues>({
        resolver: zodResolver(pessoaSchema),
        defaultValues: {
            name: "",
            tradeName: "",
            email: "",
            phone: "",
            document: "",
            briefDescription: "",
            birthDate: null,
            gender: null,
            personType: null,
        },
        mode: "onChange"
    });

    const { createPessoa, loading } = useCreatePessoa();

    const onSubmit = (data: UserFormValues) => {
        const formattedData = {
            ...data,
            birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null
        };
        createPessoa(formattedData);

    }

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Nome completo/Razão Social"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            className="w-[70%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="tradeName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Nome Fantasia/Apelido"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.tradeName}
                            helperText={errors.tradeName?.message}
                            className="w-[30%]"
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Email"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            className="w-[50%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Telefone"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            className="w-[50%]"
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="document"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="CPF/CNPJ"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.document}
                            helperText={errors.document?.message}
                            className="w-[50%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="personType"
                    control={control}
                    render={({ field }) => (
                        <FormControl className="w-[50%]" sx={formTheme}>
                            <InputLabel>Tipo de Pessoa</InputLabel>
                            <Select
                                {...field}
                                label="Tipo de Pessoa"
                                value={field.value ?? ""}
                                error={!!errors.personType}
                            >
                                <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                                <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Data de Nascimento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate?.message}
                            className="w-[50%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <FormControl className="w-[50%]" sx={formTheme} error={!!errors.gender}>
                            <InputLabel>Gênero</InputLabel>
                            <Select
                                {...field}
                                label="Gênero"
                                value={field.value ?? ""}
                                error={!!errors.gender}
                            >
                                <MenuItem value="MALE">Masculino</MenuItem>
                                <MenuItem value="FEMALE">Feminino</MenuItem>
                                <MenuItem value="OUTRO">Outro</MenuItem>
                            </Select>
                            {errors.gender && (
                                <FormHelperText>Por favor, selecione um gênero válido</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Box>

            <Controller
                name="briefDescription"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Descrição da Pessoa"
                        multiline
                        rows={4}
                        {...field}
                        value={field.value ?? ""}
                        error={!!errors.briefDescription}
                        helperText={errors.briefDescription?.message}
                        className="w-[100%]"
                        sx={formTheme}
                    />
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
        </form>
    )
}
