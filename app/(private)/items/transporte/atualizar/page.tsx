"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { StyledMainContainer } from "@/app/styles/container/container";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useUpdate } from "@/app/hooks/crud/update/update";
import { formTheme } from "@/app/styles/formTheme/theme";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetUsuario } from "@/app/hooks/usuarios/get";

const transportSchema = z.object({
    name: z.string().min(1, "Nome do EPI é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    buildingId: z.number().int().min(1, "ID do predio é obrigatório"),
    responsibleManager: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do gestor é obrigatório") }) })
});

type TransportFormValues = z.infer<typeof transportSchema>;

export default function EditarTransport() {

    const router = useRouter();
    const { data } = useGetOneById("transport");
    const { data: pessoas } = useGetUsuario({});
    const { data: predios } = useGet({ url: 'building' });
    const [file, setFile] = useState<File | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const { handleDelete } = useDelete("transport", "/items/transporte/listagem");
    const { update, loading } = useUpdate("transport", "/items/transporte/listagem");
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<TransportFormValues>({
        resolver: zodResolver(transportSchema),
        defaultValues: { name: "", description: "", buildingId: 0, responsibleManager: { connect: { id: 0 } } },
        mode: "onChange"
    });


    const handleOpenCancelModal = () => setOpenCancelModal(true);
    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/items/transporte/listagem');

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onSubmit = (formData: any) => {
        const newObject = { ...formData, file: file, buildingId: 12 };
        update(newObject, true);
    };

    useEffect(() => {
        if (data) reset({ ...data, responsibleManager: { connect: { id: data?.responsibleManagerId } }, buildingId: 1 });

        setImageInfo({
            name: data?.transportFiles[0]?.file?.fileName,
            type: data?.transportFiles[0]?.file?.fileType,
            size: data?.transportFiles[0]?.file?.size,
            previewUrl: data?.transportFiles[0]?.file?.url,
        });
    }, [data, reset]);

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
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Transporte</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Transporte"
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
                                <FormControl sx={formTheme} fullWidth error={!!errors.responsibleManager?.connect?.id}>
                                    <InputLabel id="responsible-label">Gestor Responsável</InputLabel>
                                    <Select labelId="responsible-label" label="Gestor Responsável" {...field} value={field.value || ""} >
                                        <MenuItem value="" disabled>
                                            Clique e selecione...
                                        </MenuItem>
                                        {pessoas?.map((person: any) => (
                                            <MenuItem key={person.id} value={person.id}>
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
                        <input type="file" accept="image/*" className="w-full h-full opacity-0 cursor-pointer absolute inset-0" onChange={handleFileChange} />
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
                </Box >
                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDeleteModal}>Excluir</Button>
                    <Box className="flex flex-row gap-5" >
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenCancelModal}>Cancelar</Button>
                        <Button type="submit" variant="outlined" disabled={loading} sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}</Button>
                    </Box>
                </Box>
            </form >

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
        </StyledMainContainer >
    );
}
