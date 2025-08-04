"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground, buttonThemeNoBackgroundError } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useUpdate } from "@/app/hooks/crud/update/update";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useGetUsuario } from "@/app/hooks/usuarios/get";
import { IoMdClose } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";
import { useUpdateItem } from "@/app/hooks/items/update";

const epiSchema = z.object({
    name: z.string().min(1, "Nome do EPI é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    responsibleManager: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do gestor é obrigatório") }) }),
});

type EpiFormValues = z.infer<typeof epiSchema>;

export default function EditarEPI() {

    const router = useRouter();
    const { data: ppe } = useGetOneById("ppe");
    const { data: pessoas } = useGetUsuario({});
    const { update, loading } = useUpdateItem("ppe", "/items/epi/listagem");
    const { handleDelete } = useDelete("ppe", "/items/epi/listagem");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const { control, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<EpiFormValues>({
        resolver: zodResolver(epiSchema),
        defaultValues: {
            name: "",
            description: "",
            responsibleManager: {
                connect: {
                    id: 0,
                }
            }
        },
        mode: "onChange"
    });

    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/items/epi/listagem');

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

     const onSubmit = (formData: any) => {
        const newObject = { ...formData, file: file, buildingId: 12 };
        update(newObject);
    };

    useEffect(() => {
        if (ppe) reset({ ...ppe, responsibleManager: { connect: { id: ppe?.responsibleManagerId } }, buildingId: 1 });
    }, [ppe, reset]);

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
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">EPI</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do EPI"
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
                            name="responsibleManager.connect.id"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    sx={formTheme}
                                    fullWidth
                                    error={!!errors.responsibleManager?.connect?.id}
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
                                        {pessoas?.map((person: any) => (
                                            <MenuItem key={person.id} value={person.personId}>
                                                {person.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.responsibleManager?.connect?.id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.responsibleManager.connect.id.message}
                                        </p>
                                    )}
                                </FormControl>
                            )}
                        />
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
                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" disabled={loading} sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este equipamento? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDelete} variant="outlined" sx={buttonThemeNoBackgroundError}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openCancelModal} onClose={handleCloseCancelModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar está ação? Todos os dados serão perdidos.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseCancelModal} variant="outlined" sx={buttonThemeNoBackground}>Desistir</Button>
                            <Button onClick={handleCancelConfirm} variant="outlined" sx={buttonTheme}>Comfirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

        </StyledMainContainer>
    );
}
