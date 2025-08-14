"use client";

import { z } from "zod";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { TextField, Box, Button, Modal, CircularProgress } from "@mui/material";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useCreate } from "@/app/hooks/crud/create/create";
import { formTheme } from "@/app/styles/formTheme/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoImagesOutline } from "react-icons/io5";
import { useAuthStore } from "@/app/store/storeApp";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

const predioSchema = z.object({
    name: z.string().min(1, "Nome do Predio é obrigatório"),
    latitude: z.string().min(1, "Latitude é obrigatória"),
    longitude: z.string().min(1, "Longitude é obrigatória"),
    description: z.string().min(1, "Descrição é obrigatória"),
    radius: z.number().int().min(1, "Raio é obrigatório"),
    contractId: z.number().int()
});

type PredioFormValues = z.infer<typeof predioSchema>;

export default function CadastroPredio() {

    const { userInfo } = useAuthStore();

    const { control, handleSubmit, formState: { errors, } } = useForm<PredioFormValues>({
        resolver: zodResolver(predioSchema),
        defaultValues: { name: "", latitude: "", longitude: "", description: "", contractId: Number(userInfo?.contractId), radius: 0 },
        mode: "onChange"
    });

    const router = useRouter();
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { create, loading } = useCreate("building", "/locais/predio/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const handleOpenDisableModal = () => {
        setOpenDisableModal(true);
    };

    const handleCloseDisableModal = () => {
        setOpenDisableModal(false);
    };

    const handleDisableConfirm = () => {
        router.push('/locais/predio/listagem');
    };

    const onSubmit = (formData: any) => {
        const newObject = { ...formData, image: file };
        create(newObject, true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageData = {
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
        };
        setImageInfo(imageData);
        setFile(file);
    };

    return (
        <StyledMainContainer>

            <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Prédio</h1>
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
                                className="w-[70%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Box className="w-[30%] flex flex-row justify-between gap-2">
                        <Controller
                            name="radius"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    variant="outlined"
                                    label="Raio m²"
                                    type="number"
                                    value={value ?? 0}
                                    onChange={e => onChange(parseInt(e.target.value, 10))}
                                    error={!!errors.radius}
                                    helperText={errors.radius?.message}
                                    className="w-[50%]"
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
                                    className="w-[50%]"
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
                                    className="w-[50%]"
                                    sx={formTheme}
                                />
                            )}
                        />
                    </Box>
                </Box>

                <Box className="w-full flex gap-2">
                    <Box className="w-full h-[57px] flex  items-center border border-dashed relative border-[#5e58731f] rounded-lg cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                            onChange={handleFileChange}
                        />
                        {imageInfo ? (
                            <Box className="absolute w-full flex justify-between items-center p-3">
                                <Box className="flex flex-row items-center gap-3">
                                    <img src={imageInfo.previewUrl} alt="Preview" className="w-[30px] h-[30px]" />
                                    <Box className="flex flex-col">
                                        <p className="text-[.8rem] text-[#000000]">Nome: {imageInfo.name}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tipo: {imageInfo.type}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tamanho: {(imageInfo.size / 1024).toFixed(2)} KB</p>
                                    </Box>
                                </Box>
                                <IoMdClose color="#5E5873" onClick={() => setImageInfo(null)} />
                            </Box>
                        )
                            :
                            <Box className="absolute w-full flex justify-center items-center p-3 gap-2 pointer-events-none">
                                <IoImagesOutline color="#5E5873" size={25} />
                                <p className="text-[.8rem] text-[#000000]">Selecione uma foto do EPI</p>
                            </Box>
                        }
                    </Box>
                </Box>

                <Box className="w-[100%] flex flex-row justify-between">
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
                </Box>
                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar "}</Button>
                </Box>
            </form>


            <Modal open={openDisableModal} onClose={handleCloseDisableModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

        </StyledMainContainer>
    )
}