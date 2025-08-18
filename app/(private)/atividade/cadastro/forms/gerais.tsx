'use client';

import { Controller } from "react-hook-form";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { formTheme } from "@/app/styles/formTheme/theme";
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useGetIDStore } from "@/app/store/getIDStore";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";

export default function FormDadosGerais({ setFile, control, formState: { errors } }: { setFile: any, file: any, control: any, formState: { errors: any, } }) {

    const { setId } = useGetIDStore();
    const [imageInfos, setImageInfos] = useState<Array<{ name: string; type: string; size: number; previewUrl: string }> | null>(null);
    const { data: ambientes } = useGet({ url: "environment" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const filesToAdd = Array.from(files).slice(0, 3 - (imageInfos?.length || 0));
        const newImageInfos = filesToAdd.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
            file: file
        }));
        setFile(filesToAdd);
        setImageInfos(prev => [...(prev || []), ...newImageInfos]);
    };

    const removeImage = (index: number) => {
        if (!imageInfos) return;
        const newImageInfos = [...imageInfos];
        newImageInfos.splice(index, 1);
        setImageInfos(newImageInfos.length > 0 ? newImageInfos : null);
    };



    return (
        <Box className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <Box className="flex flex-row gap-2">


                <Controller
                    name="environmentId"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth error={!!errors.environmentId}>
                            <InputLabel id="ambiente-label">Ambiente</InputLabel>
                            <Select
                                label="Ambiente"
                                {...field}
                                value={field.value || ""}
                                error={!!errors.environmentId}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    field.onChange(e.target.value)
                                }}
                            >
                                {ambientes?.map((ambiente: any) => (
                                    <MenuItem key={ambiente.id} value={ambiente.id}>
                                        {ambiente.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.environmentId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.environmentId.message}
                                </p>
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="hasRecurrence"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Atividade Recorrente</InputLabel>
                            <Select label="Atividade Recorrente" {...field} error={!!errors.hasRecurrence}>
                                <MenuItem value="true">Sim</MenuItem>
                                <MenuItem value="false">Não</MenuItem>
                            </Select>
                            {errors.hasRecurrence && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.hasRecurrence.message}
                                </p>
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="recurrenceFinalDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Repete todo dia / hora:"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.recurrenceFinalDate}
                            helperText={errors.recurrenceFinalDate?.message}
                            fullWidth
                            sx={formTheme}
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            onChange={(event) => field.onChange(new Date(event.target.value).toISOString())}
                        />
                    )}
                />
            </Box>

            <Box className="flex flex-row gap-2">

                <Controller
                    name="dateTime"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Data e hora de Início da atividade"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.dateTime}
                            helperText={errors.dateTime?.message}
                            fullWidth
                            sx={formTheme}
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            onChange={(event) => field.onChange(new Date(event.target.value).toISOString())}
                        />
                    )}
                />

                <Controller
                    name="statusEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.statusEnum}
                            >
                                <MenuItem value="OPEN">Aberto</MenuItem>
                                <MenuItem value="COMPLETED">Concluído</MenuItem>
                                <MenuItem value="UNDER_REVIEW">Em Revisão</MenuItem>
                                <MenuItem value="PENDING">Pendente</MenuItem>
                                <MenuItem value="JUSTIFIED">Justificado</MenuItem>
                                <MenuItem value="INTERNAL_JUSTIFICATION">Justificativa Interna</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.statusEnum}>
                                {errors.statusEnum?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="activityTypeEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth>
                            <InputLabel>Tipo de Atividade</InputLabel>
                            <Select
                                label="Tipo de Atividade"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.activityTypeEnum}>
                                <MenuItem value="NORMAL">Normal</MenuItem>
                                <MenuItem value="URGENT">Urgente</MenuItem>
                                <MenuItem value="RECURRING">Recorrente</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.activityTypeEnum}>
                                {errors.activityTypeEnum?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="approvalStatus"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth>
                            <InputLabel>Status de aprovação da atividade</InputLabel>
                            <Select
                                label="Status de aprovação da atividade"
                                {...field}
                                value={field.value ?? ""}
                                error={!!errors.approvalStatus}
                            >
                                <MenuItem value="PENDING">Pendente</MenuItem>
                                <MenuItem value="APPROVED">Aprovado</MenuItem>
                                <MenuItem value="REJECTED">Rejeitado</MenuItem>
                            </Select>
                            <FormHelperText error={!!errors.approvalStatus}>
                                {errors.approvalStatus?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />
            </Box>

            <Box className="w-full min-h-[57px] flex flex-col border border-dashed relative border-[#5e58731f] rounded-lg cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                    onChange={handleFileChange}
                    multiple
                    disabled={imageInfos?.length !== undefined && imageInfos.length >= 3 || false}
                />
                {imageInfos ? (
                    <Box className="w-full p-3">
                        {imageInfos.map((imageInfo, index) => (
                            <Box key={index} className="w-full flex justify-between items-center p-2 mb-2 bg-gray-50 rounded">
                                <Box className="flex flex-row items-center gap-3">
                                    <img src={imageInfo.previewUrl} alt="Preview" className="w-[30px] h-[30px]" />
                                    <Box className="flex flex-col">
                                        <p className="text-[.8rem] text-[#000000]">Nome: {imageInfo.name}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tipo: {imageInfo.type}</p>
                                        <p className="text-[.6rem] text-[#242424]">Tamanho: {(imageInfo.size / 1024).toFixed(2)} KB</p>
                                    </Box>
                                </Box>
                                <IoMdClose
                                    color="#5E5873"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="cursor-pointer z-[99999]"
                                />
                            </Box>
                        ))}
                        {imageInfos.length < 3 && (
                            <Box className="w-full flex justify-center items-center p-2 gap-2">
                                <IoImagesOutline color="#5E5873" size={25} />
                                <p className="text-[.8rem] text-[#000000]">
                                    Adicionar mais fotos ({imageInfos.length}/3)
                                </p>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box className="absolute w-full flex justify-center items-center p-3 gap-2 pointer-events-none">
                        <IoImagesOutline color="#5E5873" size={25} />
                        <p className="text-[.8rem] text-[#000000]">Selecione até 3 fotos da atividade</p>
                    </Box>
                )}
            </Box>

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Observações"
                        multiline
                        rows={3}
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        sx={formTheme}
                    />
                )}
            />

        </Box>
    );
}