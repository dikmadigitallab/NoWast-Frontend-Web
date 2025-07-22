import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, TextField, Button, IconButton, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdRemove } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useCreateEndereco } from "@/app/hooks/pessoas/endereco/create";

const addressSchema = z.object({
    addresses: z.array(z.object({
        address: z.string().min(1, "Endereço é obrigatório"),
        person: z.object({
            connect: z.object({
                id: z.number().int().min(1, "ID da pessoa é obrigatório"),
            })
        }),
        number: z.string().min(1, "Número é obrigatório"),
        complement: z.string().optional(),
        district: z.string().min(1, "Bairro é obrigatório"),
        city: z.string().min(1, "Cidade é obrigatória"),
        state: z.string().min(1, "Estado é obrigatório"),
        postalCode: z.string().min(1, "CEP é obrigatório"),
        addressType: z.string().optional(),
        stateAbbreviation: z.string().optional(),
        country: z.string().optional(),
        isDefault: z.boolean().optional(),
        isOptIn: z.boolean().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional()
    }))
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function FormEndereco() {
    const { id } = useGetIDStore();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addresses: [{
                address: "",
                person: {
                    connect: {
                        id: parseInt(id),
                    }
                },
                number: "",
                complement: "",
                district: "",
                city: "",
                state: "",
                postalCode: "",
                addressType: "",
                stateAbbreviation: "",
                country: "",
                isDefault: false,
                isOptIn: false,
                latitude: "",
                longitude: ""
            }]
        },
        mode: "onChange"
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "addresses"
    });

    const { createEndereco, loading } = useCreateEndereco()

    const onSubmit = (data: AddressFormValues) => {
        createEndereco(data);
    }

    return (
        <form className="w-[100%] flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" component="h3">
                Endereços
            </Typography>

            {fields.map((field, index) => (
                <Box key={field.id} className="flex flex-col gap-4">
                    <Box className="flex justify-between items-center">
                        <Typography variant="subtitle1">Endereço #{index + 1}</Typography>
                        {fields.length > 1 && (
                            <IconButton onClick={() => remove(index)} color="error">
                                <IoMdRemove />
                            </IconButton>
                        )}
                    </Box>

                    <Box className="w-[100%] flex flex-row justify-between gap-2">
                        <Controller
                            name={`addresses.${index}.postalCode`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="CEP"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.postalCode}
                                    helperText={errors.addresses?.[index]?.postalCode?.message}
                                    className="w-[33%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name={`addresses.${index}.stateAbbreviation`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="UF"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.stateAbbreviation}
                                    helperText={errors.addresses?.[index]?.stateAbbreviation?.message}
                                    className="w-[33%]"
                                    sx={formTheme}
                                />
                            )}
                        />

                        <Controller
                            name={`addresses.${index}.address`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Endereço"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.address}
                                    helperText={errors.addresses?.[index]?.address?.message}
                                    className="w-[33%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name={`addresses.${index}.number`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Número"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.number}
                                    helperText={errors.addresses?.[index]?.number?.message}
                                    className="w-[33%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />
                    </Box>

                    <Controller
                        name={`addresses.${index}.complement`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Complemento"
                                {...field}
                                error={!!errors.addresses?.[index]?.complement}
                                helperText={errors.addresses?.[index]?.complement?.message}
                                className="w-full"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Box className="w-[100%] flex flex-row justify-between gap-2">
                        <Controller
                            name={`addresses.${index}.district`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Bairro"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.district}
                                    helperText={errors.addresses?.[index]?.district?.message}
                                    className="w-[40%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name={`addresses.${index}.city`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Cidade"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.city}
                                    helperText={errors.addresses?.[index]?.city?.message}
                                    className="w-[40%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name={`addresses.${index}.state`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Estado"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.state}
                                    helperText={errors.addresses?.[index]?.state?.message}
                                    className="w-[20%]"
                                    sx={formTheme}
                                    required
                                />
                            )}
                        />
                    </Box>

                    <Box className="w-[100%] flex flex-row justify-between gap-2">
                        <Controller
                            name={`addresses.${index}.addressType`}
                            control={control}
                            render={({ field }) => (
                                <FormControl className="w-[50%]" sx={formTheme}>
                                    <InputLabel>Tipo de Endereço</InputLabel>
                                    <Select
                                        {...field}
                                        label="Tipo de Endereço"
                                        error={!!errors.addresses?.[index]?.addressType}
                                    >
                                        <MenuItem value="RESIDENCIAL">Residencial</MenuItem>
                                        <MenuItem value="COMERCIAL">Comercial</MenuItem>
                                        <MenuItem value="COBRANÇA">Cobrança</MenuItem>
                                        <MenuItem value="ENTREGA">Entrega</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name={`addresses.${index}.country`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="País"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.country}
                                    helperText={errors.addresses?.[index]?.country?.message}
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>

                    <Box className="w-[100%] flex flex-row justify-between gap-2">
                        <Controller
                            name={`addresses.${index}.latitude`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Latitude"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.latitude}
                                    helperText={errors.addresses?.[index]?.latitude?.message}
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Controller
                            name={`addresses.${index}.longitude`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Longitude"
                                    {...field}
                                    error={!!errors.addresses?.[index]?.longitude}
                                    helperText={errors.addresses?.[index]?.longitude?.message}
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>

                    <Box className="flex gap-4">
                        <Controller
                            name={`addresses.${index}.isDefault`}
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} />}
                                    label="Endereço Principal"
                                />
                            )}
                        />
                        <Controller
                            name={`addresses.${index}.isOptIn`}
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} />}
                                    label="Opt-in"
                                />
                            )}
                        />
                    </Box>
                </Box>
            ))}

            <Button
                variant="outlined"
                sx={buttonTheme}
                startIcon={<FaPlus />}
                onClick={() => append({
                    address: "",
                    person: {
                        connect: {
                            id: parseInt(id)
                        }
                    },
                    number: "",
                    complement: "",
                    district: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    addressType: "",
                    stateAbbreviation: "",
                    country: "",
                    isDefault: false,
                    isOptIn: false,
                    latitude: "",
                    longitude: ""
                })}
            >
                Adicionar Endereço
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