"use client";

import { z } from "zod";
import { TextField, Button, Box, Modal, CircularProgress, Chip, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useUpdateAmbiente } from "@/app/hooks/locais/ambiente/update";

const servicoSchema = z.object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    environment: z.object({ connect: z.object({ id: z.number() }) }),
    serviceType: z.object({ connect: z.object({ id: z.number().nullable(), name: z.string().optional() }) }),
    serviceItens: z.object({
        create: z.array(z.object({
            name: z.string().min(1, "Pelo menos um item de serviço é obrigatório")
        }))
    })
});

type ServicoFormValues = z.infer<typeof servicoSchema>;

export default function FormServicos() {

    const router = useRouter();
    const { id } = useGetIDStore();
    const { data } = useGetOneById("service");
    const [newItem, setNewItem] = useState("");
    const { data: tiposServicos } = useGet("serviceType");
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [serviceItems, setServiceItems] = useState<{ name: string }[]>([]);
    const { update, loading } = useUpdateAmbiente("service", "/locais/ambiente/listagem");

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<ServicoFormValues>({
        resolver: zodResolver(servicoSchema),
        defaultValues: { name: "", environment: { connect: { id: id } }, serviceType: { connect: { id: null } }, serviceItens: { create: [] } },
        mode: "onChange"
    });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/locais/ambiente/listagem');

    const addServiceItem = () => {
        if (newItem.trim()) {
            const newItemObj = { name: newItem.trim() };
            const updatedItems = [...serviceItems, newItemObj];
            setServiceItems(updatedItems);
            setValue("serviceItens", { create: updatedItems });
            setNewItem("");
        }
    };

    const removeServiceItem = (indexToRemove: number) => {
        const updatedItems = serviceItems.filter((_, index) => index !== indexToRemove);
        setServiceItems(updatedItems);
        setValue("serviceItens", { create: updatedItems });
    };

    const onSubmit = (formData: ServicoFormValues) => update(formData);

    useEffect(() => {
        if (data) {
            reset({ ...data, environment: { connect: { id: data.environmentId } }, serviceType: { connect: { id: data.serviceTypeId } } });
        }
    }, [data])

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Serviços</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro de Limpeza</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Serviço"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="serviceType.connect.id"
                        control={control}
                        render={({ field }) => (
                            <FormControl
                                sx={formTheme}
                                fullWidth
                                error={!!errors.serviceType?.connect?.id}
                            >
                                <InputLabel id="responsible-label">Tipo de Serviço</InputLabel>
                                <Select
                                    labelId="responsible-label"
                                    label="Tipo de Serviço"
                                    {...field}
                                    value={field.value || ""}
                                >
                                    <MenuItem value="" disabled>
                                        Clique e selecione...
                                    </MenuItem>
                                    {tiposServicos?.map((person: any) => (
                                        <MenuItem key={person.id} value={person.id}>
                                            {person.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.serviceType?.connect?.id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.serviceType.connect.id.message}
                                    </p>
                                )}
                            </FormControl>
                        )}
                    />

                    <Box className="flex flex-col gap-2">
                        <Box className="flex gap-2 h-[55px]">
                            <TextField
                                label="Novo Item de Serviço"
                                variant="outlined"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                sx={[formTheme, { height: "100%" }]}
                                fullWidth
                            />
                            <Button
                                variant="outlined"
                                onClick={addServiceItem}
                                sx={[buttonTheme, { height: "100%" }]}
                            >
                                Adicionar
                            </Button>
                        </Box>

                        {errors.serviceItens && (
                            <p className="text-red-500 text-sm">{errors.serviceItens.message}</p>
                        )}

                        <Box className="flex flex-wrap gap-2">
                            {serviceItems.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item.name}
                                    onDelete={() => removeServiceItem(index)}
                                    sx={{ backgroundColor: '#00b288', color: 'white' }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
                    </Button>
                </Box>
            </form>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}