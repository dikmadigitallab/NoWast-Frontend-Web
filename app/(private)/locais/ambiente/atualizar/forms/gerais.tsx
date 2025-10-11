"use client";

import { z } from "zod";
import { TextField, MenuItem, InputLabel, Select, FormControl, Button, Box, Modal, CircularProgress } from "@mui/material";
import CustomAutocomplete from "@/app/components/CustomAutocomplete";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground, buttonThemeNoBackgroundError } from "@/app/styles/buttonTheme/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useUpdateAmbiente } from "@/app/hooks/ambiente/update";
import { useTerminateEnvironment } from "@/app/hooks/ambiente/terminate";
import { useDelete } from "@/app/hooks/crud/delete/useDelete";
import { useDebounce } from "@/app/utils/useDebounce";

const ambienteSchema = z.object({
    name: z.string().min(1, "Nome do Ambiente é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    areaM2: z.number().min(1, "Área em metros quadrados é obrigatória").nullable(),
    sector: z.object({ connect: z.object({ id: z.number().int().min(1, "ID do Setor é obrigatório").nullable() }) }),
    createdAt: z.string({ message: "Data de início é obrigatória" }).optional(),
    deletedAt: z.string({ message: "Data de fim é obrigatória" }).optional(),
});

type AmbienteFormValues = z.infer<typeof ambienteSchema>;

export default function FormDadosGerais() {

    const router = useRouter();
    const [disable, setDisable] = useState(false);
    const [tempEndDate, setTempEndDate] = useState("");
    const [searchQuerySetores, setSearchQuerySetores] = useState('');
    const debouncedSearchQuerySetores = useDebounce(searchQuerySetores, 500);
    
    const { data: setoresRaw, loading: loadingSetores } = useGet({ 
        url: "sector",
        query: debouncedSearchQuerySetores,
        pageSize: 25,
        pageNumber: 1
    });

    // Remove duplicatas baseadas no ID
    const setores = setoresRaw ? setoresRaw.filter((setor: any, index: number, self: any[]) => 
        index === self.findIndex((s: any) => s.id === setor.id)
    ) : [];

    const { update } = useUpdateAmbiente("environment");
    const { terminate, loading: terminateLoading } = useTerminateEnvironment();
    const { data, loading } = useGetOneById("environment");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);
    const [openDisableModal, setOpenDisableModal] = useState(false);
    const { handleDelete } = useDelete("environment", "/locais/ambiente/listagem");

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AmbienteFormValues>({
        resolver: zodResolver(ambienteSchema),
        defaultValues: {
            name: "",
            description: "",
            areaM2: null,
            createdAt: "",
            deletedAt: "",
            sector: { connect: { id: null } }
        },
        mode: "onChange"
    });

    const handleOpenModal = (field: string) => {
        if (field === "cancelar") {
            setOpenCancelModal(true);
        } else {
            setTempEndDate(new Date().toISOString().split('T')[0]);
            setOpenDisableModal(true);
        }
    };

    const handleCloseModal = (field: string) => {
        if (field === "cancelar") {
            setOpenCancelModal(false);
        } else {
            setOpenDisableModal(false);
        }
    };

    const handleConfirmDisable = async () => {
        // Validação: a data não pode ser superior a hoje
        const today = new Date().toISOString().split('T')[0];
        const createdAt = watch('createdAt');
        
        if (tempEndDate > today) {
            alert('A data de fim não pode ser superior à data atual.');
            return;
        }
        
        if (createdAt && tempEndDate <= createdAt) {
            alert('A data de fim deve ser posterior à data de criação.');
            return;
        }

        try {
            const environmentId = data?.id;
            if (!environmentId) {
                alert('ID do ambiente não encontrado.');
                return;
            }

            await terminate(environmentId, { deletedAt: tempEndDate + "T23:59:59.999Z" });
            
            // Se chegou até aqui, a desabilitação foi bem-sucedida
            setDisable(true);
            setValue("deletedAt", tempEndDate);
            setOpenDisableModal(false);
        } catch (error) {
            console.error('Erro ao desabilitar ambiente:', error);
            alert('Erro ao desabilitar ambiente. Tente novamente.');
        }
    };

    const handleCloseCancelModal = () => setOpenCancelModal(false);
    const handleCancelConfirm = () => router.push('/locais/ambiente/listagem');

    const onSubmit = (formData: AmbienteFormValues) => {
        console.log("===== DADOS ENVIADOS PARA API =====");
        console.log("FormData:", formData);
        console.log("createdAt:", formData.createdAt);
        console.log("deletedAt:", formData.deletedAt);
        console.log("===================================");
        update(formData);
    };

    useEffect(() => {
        if (data) {
            console.log("===== DADOS COMPLETOS DA API =====");
            console.log("Dados recebidos:", data);
            console.log("Campos disponíveis:", Object.keys(data));
            console.log("createdAt:", data.createdAt);
            console.log("deletedAt:", data.deletedAt);
            console.log("===================================");
            
            // Converter createdAt para formato de data (YYYY-MM-DD)
            const startDate = data.createdAt ? data.createdAt.split('T')[0] : "";
            const endDate = data.deletedAt ? data.deletedAt.split('T')[0] : "";
            
            console.log("startDate convertido:", startDate);
            console.log("endDate convertido:", endDate);
            
            reset({ 
                ...data, 
                sector: { connect: { id: data.sectorId } },
                createdAt: startDate,
                deletedAt: endDate
            });
            
            // Se há deletedAt, significa que está "deletado" (desabilitado)
            if (data.deletedAt) {
                setDisable(true);
            }
        }
    }, [data])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 border border-[#5e58731f] rounded-lg">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Ambientes</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Editar</h1>
                </Box>

                <Box className="w-full flex flex-col gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Nome do Ambiente"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="sector.connect.id"
                        control={control}
                        render={({ field }) => (
                            <CustomAutocomplete
                                options={setores || []}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={setores?.find((setor: any) => setor.id === field.value) || null}
                                loading={loadingSetores}
                                onInputChange={(newInputValue) => {
                                    setSearchQuerySetores(newInputValue);
                                }}
                                onChange={(newValue) => {
                                    const value = newValue?.id || '';
                                    field.onChange(Number(value));
                                }}
                                label="Setor"
                                error={!!errors.sector?.connect?.id}
                                helperText={errors.sector?.connect?.id?.message}
                                noOptionsText="Nenhum setor encontrado"
                                loadingText="Carregando setores..."
                                className="w-full"
                            />
                        )}
                    />

                    <Controller
                        name="areaM2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Dimensão"
                                variant="outlined"
                                type="number"
                                {...field}
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? null : Number(value));
                                }}
                                error={!!errors.areaM2}
                                helperText={errors.areaM2?.message}
                                sx={formTheme}
                            />
                        )}
                    />
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
                    <Box className="w-[100%] flex flex-row gap-5">
                        <Controller
                            name="createdAt"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    label="Data Ínicio"
                                    InputLabelProps={{ shrink: true }}
                                    type="date"
                                    {...field}
                                    error={!!errors.createdAt}
                                    helperText={errors.createdAt?.message}
                                    className="w-full"
                                    sx={formTheme}
                                />
                            )}
                        />
                        <Controller
                            name="deletedAt"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    disabled={!disable}
                                    variant="outlined"
                                    label="Data Fim"
                                    InputLabelProps={{ shrink: true }}
                                    type="date"
                                    {...field}
                                    error={!!errors.deletedAt}
                                    helperText={errors.deletedAt?.message}
                                    className="w-full"
                                    sx={[formTheme, { opacity: disable ? 1 : 0.8 }]}
                                    onChange={(e) => {
                                        console.log("Campo deletedAt alterado:", e.target.value);
                                        field.onChange(e.target.value);
                                    }}
                                    inputProps={{
                                        max: new Date().toISOString().split('T')[0]
                                    }}
                                />
                            )}
                        />
                    </Box>

                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-between">
                    <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => handleOpenModal("desabilitar")}>Desabilitar</Button>
                    <Box className="flex flex-row gap-5">
                        <Button variant="outlined" sx={buttonThemeNoBackground} onClick={() => handleOpenModal("cancelar")}>Cancelar</Button>
                        <Button type="submit" variant="outlined" sx={[buttonTheme, { alignSelf: "end" }]} disabled={loading}>
                            {loading ? <CircularProgress color="inherit" size={24} /> : "Salvar"}
                        </Button>
                    </Box>
                </Box>
            </form>

            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Confirmar exclusão</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente excluir este item? Está ação não pode ser desfeita.</p>
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={handleCloseDeleteModal} variant="outlined" sx={buttonThemeNoBackground}>Voltar</Button>
                            <Button onClick={handleDelete} variant="outlined" sx={buttonThemeNoBackgroundError}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

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

            <Modal open={openDisableModal} onClose={() => handleCloseModal("desabilitar")} aria-labelledby="disable-confirmation-modal" aria-describedby="disable-confirmation-modal-description">
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg p-6">
                    <Box className="flex flex-col gap-[30px]">
                        <h2 className="text-xl font-semibold text-[#5E5873] self-center">Desabilitar Ambiente</h2>
                        <p className="text-[#6E6B7B] text-center">Deseja realmente desabilitar esse ambiente?</p>
                        <TextField
                            variant="outlined"
                            label="Data Fim"
                            InputLabelProps={{ shrink: true }}
                            type="date"
                            value={tempEndDate}
                            onChange={(e) => setTempEndDate(e.target.value)}
                            inputProps={{
                                min: watch('createdAt') ? new Date(new Date(watch('createdAt')!).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
                                max: new Date().toISOString().split('T')[0] // Impede seleção de datas futuras
                            }}
                            error={!!errors.deletedAt}
                            helperText={errors.deletedAt?.message || "A data deve ser posterior à data de criação e não pode ser futura"}
                            className="w-full"
                            sx={[formTheme]}
                        />
                        <Box className="flex justify-center gap-4 py-3 border-t border-[#5e58731f] rounded-b-lg">
                            <Button onClick={() => handleCloseModal("desabilitar")} variant="outlined" sx={buttonThemeNoBackground}>Cancelar</Button>
                            <Button
                                variant="outlined"
                                onClick={handleConfirmDisable}
                                sx={buttonTheme}
                                disabled={!tempEndDate || terminateLoading}
                            >
                                {terminateLoading ? <CircularProgress color="inherit" size={24} /> : "Confirmar"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}