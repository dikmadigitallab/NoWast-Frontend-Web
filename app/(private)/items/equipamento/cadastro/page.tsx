"use client";

import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useCreate } from "@/app/hooks/crud/create/create";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { formTheme } from "@/app/styles/formTheme/theme";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { IoImagesOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { z } from "zod";

const equipamentoSchema = z.object({
    name: z.string().min(1, "Nome do EPI é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do predio é obrigatório"),
    responsibleManagerId: z.number().int().min(1, "ID do gestor é obrigatório")
});

type EquipamentoFormValues = z.infer<typeof equipamentoSchema>;

export default function CadastroEquipamento() {

    const router = useRouter();
    const { data: pessoas } = useGetUsuario({});
    const [file, setFile] = useState<File | null>(null);
    const { data: predios } = useGet({ url: 'building' });
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const { create, loading } = useCreate("tools", "/items/equipamento/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<EquipamentoFormValues>({
        resolver: zodResolver(equipamentoSchema),
        defaultValues: { name: "", description: "", buildingId: 0, responsibleManagerId: undefined },
        mode: "onChange"
    });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/items/equipamento/listagem');

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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Equipamentos</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Equipamento"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Box className="flex flex-row gap-2">
                        <Controller
                            name="responsibleManagerId"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    sx={formTheme}
                                    fullWidth
                                    error={!!errors.responsibleManagerId}
                                >
                                    <InputLabel id="responsible-label">Gestor Responsável</InputLabel>
                                    <Select
                                        labelId="responsible-label"
                                        label="Gestor Responsável"
                                        {...field}
                                        value={field.value || ""}
                                    >
                                        <MenuItem value="" disabled>
                                            Clique e selecione...
                                        </MenuItem>
                                        {pessoas?.map((pessoa: any) => (
                                            <MenuItem key={pessoa.id} value={pessoa.id}>
                                                {pessoa.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.responsibleManagerId && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.responsibleManagerId.message}
                                        </p>
                                    )}
                                </FormControl>
                            )}
                        />
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
                    </Box>

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
                                <p className="text-[.8rem] text-[#000000]">Selecione uma foto do equipamento</p>
                            </Box>
                        }
                    </Box>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Descrição"
                                variant="outlined"
                                multiline
                                rows={6}
                                {...field}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                    <Button variant="outlined" disabled={loading} type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}
