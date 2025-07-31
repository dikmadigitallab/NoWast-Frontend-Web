"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetPessoa } from "@/app/hooks/pessoas/pessoa/get";
import { useCreate } from "@/app/hooks/crud/create/useCreate";
import { IoMdClose } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";

const produtoSchema = z.object({
    name: z.string().min(1, "Nome do Produto é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    responsibleManager: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do gestor é obrigatório") }) }),
});

type ProdutoFormValues = z.infer<typeof produtoSchema>;

export default function CadastroProduto() {

    const router = useRouter();
    const { data: pessoas } = useGetPessoa();
    const { create, loading } = useCreate("transport", "/items/transporte/listagem");
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; previewUrl: string; } | null>(null);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProdutoFormValues>({
        resolver: zodResolver(produtoSchema),
        defaultValues: { name: "", description: "", responsibleManager: { connect: { id: 0 } } },
        mode: "onChange"
    });

    const handleOpenDisableModal = () => setOpenDisableModal(true);
    const handleCloseDisableModal = () => setOpenDisableModal(false);
    const handleDisableConfirm = () => router.push('/items/transporte/listagem');

    const onSubmit = (formData: any) => {
        create(formData);
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
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Transportes</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
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
                                    <p className="text-[.8rem] text-[#000000]">Selecione uma foto do transporte</p>
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

                <Box className="flex flex-row justify-end gap-4">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={handleOpenDisableModal}>Cancelar</Button>
                    <Button variant="outlined" type="submit" disabled={loading} sx={[buttonTheme, { alignSelf: "end" }]}>{loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}</Button>
                </Box>
            </form>

            {/* Modal de cancelamento */}
            <Modal open={openDisableModal} onClose={handleCloseDisableModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar Cancelamento</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente cancelar esse cadastro? Todos os dados serão apagados.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f]">
                            <Button onClick={handleCloseDisableModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDisableConfirm} variant="outlined" sx={buttonTheme}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </StyledMainContainer>
    );
}
