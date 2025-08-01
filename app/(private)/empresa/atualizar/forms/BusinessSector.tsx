import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useCreate } from "@/app/hooks/crud/create/useCreate";

const businessSectorSchema = z.object({
    description: z.string().min(1, "Por favor, insira a descrição do setor de negocio"),
});

type UserFormValues = z.infer<typeof businessSectorSchema>;

export default function FormBusinessSector() {

    const { control, handleSubmit, formState: { errors }, } = useForm<UserFormValues>({ resolver: zodResolver(businessSectorSchema), defaultValues: { description: "" }, mode: "onChange" });
    const { create, loading } = useCreate("businessSector", "/empresa/listagem");

    const onSubmit = (data: UserFormValues) => {
        create(data);
    }

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Nome completo/Razão Social"
                            {...field}
                            value={field.value ?? ""}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            className="w-[100%]"
                            sx={formTheme}
                        />
                    )}
                />
            </Box>
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
