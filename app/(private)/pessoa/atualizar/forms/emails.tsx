import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, TextField, Button, IconButton, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdRemove } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useCreateEmail } from "@/app/hooks/pessoas/email/create";
import { useGetIDStore } from "@/app/store/getIDStore";

const pessoaSchema = z.object({
    emails: z.array(z.object({
        email: z.string().email("Email inválido"),
        person: z.object({
            connect: z.object({
                id: z.number().int().min(1, "ID da pessoa é obrigatório")
            })
        }),
        isDefault: z.boolean()
    })),

});

type UserFormValues = z.infer<typeof pessoaSchema>;


export default function FormEmails() {

    const { id } = useGetIDStore();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<UserFormValues>({
        resolver: zodResolver(pessoaSchema),
        defaultValues: {
            emails: [{
                email: "",
                person: {
                    connect: {
                        id: parseInt(id),
                    }
                },
                isDefault: false
            }],
        },
        mode: "onChange"
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "emails"
    });


    const { createEmail, loading } = useCreateEmail();

    const onSubmit = (data: UserFormValues) => {
        createEmail(data);
    }

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" component="h3">
                Emails
            </Typography>

            {fields.map((field, index) => (
                <Box key={field.id} className="flex flex-col gap-3">
                    <Box className="flex justify-between items-center">
                        <Typography variant="subtitle1">Email #{index + 1}</Typography>
                        {fields.length > 1 && (
                            <IconButton onClick={() => remove(index)} color="error">
                                <IoMdRemove />
                            </IconButton>
                        )}
                    </Box>

                    <Controller
                        name={`emails.${index}.email`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Email"
                                {...field}
                                error={!!errors.emails?.[index]?.email}
                                helperText={errors.emails?.[index]?.email?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name={`emails.${index}.isDefault`}
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
                                label="Tornar este email o padrão"
                            />
                        )}
                    />
                </Box>
            ))}

            <Button
                variant="outlined"
                startIcon={<FaPlus />}
                onClick={() => append({
                    email: "",
                    person: {
                        connect: {
                            id: parseInt(id)
                        }
                    },
                    isDefault: false
                })}
                sx={buttonTheme}
            >
                Adicionar Email
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