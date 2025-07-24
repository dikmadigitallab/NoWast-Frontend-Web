import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, TextField, Button, IconButton, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdRemove } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useCreateTelefone } from "@/app/hooks/pessoas/telefone/create";
import { useGetIDStore } from "@/app/store/getIDStore";

const telefoneSchema = z.object({
    phones: z.array(z.object({
        phoneNumber: z.string().min(1, "Telefone é obrigatório"),
        person: z.object({
            connect: z.object({
                id: z.number().int().min(1, "ID da pessoa é obrigatório"),
            })
        }),
        isDefault: z.boolean()
    })),
});

type UserFormValues = z.infer<typeof telefoneSchema>;

export default function FormTelefones() {

    const { id } = useGetIDStore();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<UserFormValues>({
        resolver: zodResolver(telefoneSchema),
        defaultValues: {
            phones: [{
                phoneNumber: "",
                person: {
                    connect: {
                        id: parseInt(id)
                    }
                },
                isDefault: false
            }]
        },
        mode: "onChange"
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phones"
    });
    const { createTelefone, loading } = useCreateTelefone()
    const onSubmit = (data: UserFormValues) => {
        createTelefone(data);
    }

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" component="h3">
                Telefones
            </Typography>

            {fields.map((field, index) => (
                <Box key={field.id} className="flex flex-col gap-3">
                    <Box className="flex justify-between items-center">
                        <Typography variant="subtitle1">Telefone #{index + 1}</Typography>
                        {fields.length > 1 && (
                            <IconButton onClick={() => remove(index)} color="error">
                                <IoMdRemove />
                            </IconButton>
                        )}
                    </Box>

                    <Controller
                        name={`phones.${index}.phoneNumber`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Número de Telefone"
                                {...field}
                                error={!!errors.phones?.[index]?.phoneNumber}
                                helperText={errors.phones?.[index]?.phoneNumber?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name={`phones.${index}.isDefault`}
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value || false}
                                        color="primary"
                                    />
                                }
                                label="Telefone Principal"
                            />
                        )}
                    />
                </Box>
            ))}

            <Button
                variant="outlined"
                startIcon={<FaPlus />}
                onClick={() => append({
                    phoneNumber: "",
                    person: {
                        connect: {
                            id: parseInt(id),
                        }
                    },
                    isDefault: false
                })}
                sx={buttonTheme}
            >
                Adicionar Telefone
            </Button>
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