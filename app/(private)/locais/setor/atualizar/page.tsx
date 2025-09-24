"use client";

import { z } from "zod";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, Modal, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useUpdate } from "@/app/hooks/crud/update/update";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { StyledMainContainer } from "@/app/styles/container/container";
import { IoImagesOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { ImageUploader } from "@/app/components/imageGet";

const setorSchema = z.object({
    name: z.string().min(1, "Nome do Setor é obrigatório"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do edifício é obrigatório")
});

type SetorFormValues = z.infer<typeof setorSchema>;

export default function EditarSetor() {

    const { control, handleSubmit, formState: { errors }, reset } = useForm<SetorFormValues>({
        resolver: zodResolver(setorSchema),
        defaultValues: { name: "", radius: 0, latitude: "", longitude: "", description: "", buildingId: 0 },
        mode: "onChange"
    });

    const router = useRouter();
    const { data: setor } = useGetOneById("sector");
    const [file, setFile] = useState<File | null>(null);
    const { data: predios } = useGet({ url: "building" });
    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const { handleDelete } = useDelete("sector", "/locais/setor/listagem");
    const handleCancelConfirm = () => router.push("/locais/setor/listagem");
    const { update, loading } = useUpdate("sector", "/locais/setor/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onSubmit = (formData: any) => {
        const newObject = { ...formData, image: file };
        update(newObject, true);
    };

    useEffect(() => {
        if (setor) reset({ ...setor, id: setor.id, buildingId: setor.buildingId });

        setImageInfo({
            name: setor?.sectorFiles[0]?.file?.fileName,
            type: setor?.sectorFiles[0]?.file?.fileType,
            size: setor?.sectorFiles[0]?.file?.size,
            previewUrl: setor?.sectorFiles[0]?.file?.url,
        });

    }, [setor, reset]);



    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Setor</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome do Prédio"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Latitudeº"
                                {...field}
                                error={!!errors.latitude}
                                helperText={errors.latitude?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Longitudeº"
                                {...field}
                                error={!!errors.longitude}
                                helperText={errors.longitude?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="radius"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <TextField
                                type="number"
                                variant="outlined"
                                label="Raio (m²)"
                                {...field}
                                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                                error={!!errors.radius}
                                helperText={errors.radius?.message}
                                className="w-[100%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-full flex gap-2">
                    <FormControl fullWidth error={!!errors.buildingId}>
                        <InputLabel id="building-label">Prédio</InputLabel>
                        <Controller
                            name="buildingId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="building-label"
                                    label="Prédios"
                                    value={field.value || ""}
                                    error={!!errors.buildingId}
                                >
                                    <MenuItem value="" disabled>Selecione um prédio...</MenuItem>
                                    {predios?.map((building: any) => (
                                        <MenuItem key={building.id} value={building.id}>
                                            {building.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.buildingId && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.buildingId.message}
                            </p>
                        )}
                    </FormControl>

                    <ImageUploader
                        defaultValue={imageInfo}
                        label="Selecione uma foto do setor"
                        onChange={(file: any) => setFile(file)}
                    />
                </Box>

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição"
                            multiline
                            rows={10}
                            {...field}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            className="w-[100%]"
                            sx={formTheme}
                        />
                    )}
                />
                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" disabled={loading} sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este item? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleDelete} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar está ação? Todos os dados serão perdidos.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Comfirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    )
}