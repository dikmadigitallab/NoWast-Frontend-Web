'use client';

import { Controller, useForm } from "react-hook-form";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { formTheme } from "@/app/styles/formTheme/theme";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { useGet } from "@/app/hooks/crud/get/useGet";


export default function FormDadosGerais({ control, formState: { errors } }: { control: any, formState: { errors: any, } }) {

    const { data: ambientes } = useGet({ url: "environment" });
    const { data: predios } = useGet({ url: "building" });
    const { data: setores } = useGet({ url: "sector" });
    const { data: servicos } = useGet({ url: "service" });
    const { data: tipos_servicos } = useGet({ url: "serviceType" });

    return (
        <form className="w-[100%] flex flex-col p-5 border gap-5 border-[#5e58731f] rounded-lg">

            <Box className="w-[100%] flex flex-row justify-between gap-2">

                <Controller
                    name="environmentId"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth error={!!errors.environmentId}>
                            <InputLabel id="ambiente-label">Ambiente</InputLabel>
                            <Select labelId="ambiente-label" label="Ambiente" {...field} value={field.value || ""}>
                                <MenuItem value="" disabled>
                                    Clique e selecione...
                                </MenuItem>
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
                    name="recurrenceEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Recorrência</InputLabel>
                            <Select
                                label="Recorrência"
                                {...field}
                                error={!!errors.recurrenceEnum}
                            >
                                <MenuItem value="DAILY">Diária</MenuItem>
                                <MenuItem value="WEEKLY">Semanal</MenuItem>
                                <MenuItem value="MONTHLY">Mensal</MenuItem>
                                <MenuItem value="YEARLY">Anual</MenuItem>
                                <MenuItem value="NONE">Nenhuma</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name="dateTime"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Data e Hora"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.dateTime}
                            helperText={errors.dateTime?.message}
                            fullWidth
                            sx={formTheme}
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
                                error={!!errors.statusEnum}
                            >
                                <MenuItem value="OPEN">Aberto</MenuItem>
                                <MenuItem value="IN_PROGRESS">Em Progresso</MenuItem>
                                <MenuItem value="COMPLETED">Concluído</MenuItem>
                                <MenuItem value="CANCELLED">Cancelado</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name="activityTypeEnum"
                    control={control}
                    render={({ field }) => (
                        <FormControl sx={formTheme} fullWidth >
                            <InputLabel>Tipo de Atividade</InputLabel>
                            <Select
                                label="Tipo de Atividade"
                                {...field}
                                error={!!errors.activityTypeEnum}
                            >
                                <MenuItem value="NORMAL">Normal</MenuItem>
                                <MenuItem value="EXTRA">Extra</MenuItem>
                                <MenuItem value="URGENT">Urgente</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <FormControl sx={formTheme} fullWidth >
                    <InputLabel id="predio-label">Prédio</InputLabel>
                    <Select labelId="predio-label" label="Prédio">
                        <MenuItem value="" disabled>
                            Clique e selecione...
                        </MenuItem>
                        {predios?.map((predio: any) => (
                            <MenuItem key={predio.id} value={predio.id}>
                                {predio.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.environmentId && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.environmentId.message}
                        </p>
                    )}
                </FormControl>

                <FormControl sx={formTheme} fullWidth>
                    <InputLabel id="setor-label">Setor</InputLabel>
                    <Select labelId="setor-label" label="Setor">
                        <MenuItem value="" disabled>
                            Clique e selecione...
                        </MenuItem>
                        {setores?.map((setor: any) => (
                            <MenuItem key={setor.id} value={setor.id}>
                                {setor.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.environmentId && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.environmentId.message}
                        </p>
                    )}
                </FormControl>
            </Box>

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <FormControl sx={formTheme} fullWidth>
                    <InputLabel id="servico-label">Serviço</InputLabel>
                    <Select labelId="servico-label" label="Serviço">
                        <MenuItem value="" disabled>
                            Clique e selecione...
                        </MenuItem>
                        {servicos?.map((servico: any) => (
                            <MenuItem key={servico.id} value={servico.id}>
                                {servico.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.environmentId && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.environmentId.message}
                        </p>
                    )}
                </FormControl>

                <FormControl sx={formTheme} fullWidth>
                    <InputLabel id="tipo_servico-label">Tipo</InputLabel>
                    <Select labelId="tipo_servico-label" label="Tipo">
                        <MenuItem value="" disabled>
                            Clique e selecione...
                        </MenuItem>
                        {tipos_servicos?.map((tipo_servico: any) => (
                            <MenuItem key={tipo_servico.id} value={tipo_servico.id}>
                                {tipo_servico.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.environmentId && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.environmentId.message}
                        </p>
                    )}
                </FormControl>
            </Box>

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Descrição"
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        sx={formTheme}
                    />
                )}
            />

            <Box className="w-[100%] flex flex-row justify-between gap-2">

                <Controller
                    name="supervisorId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="ID do Supervisor"
                            type="number"
                            {...field}
                            error={!!errors.supervisorId}
                            helperText={errors.supervisorId?.message}
                            fullWidth
                            sx={formTheme}
                        />
                    )}
                />

                <Controller
                    name="managerId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="ID do Gerente"
                            type="number"
                            {...field}
                            error={!!errors.managerId}
                            helperText={errors.managerId?.message}
                            fullWidth
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Controller
                name="observation"
                control={control}
                render={({ field }) => (
                    <TextField
                        variant="outlined"
                        label="Observações"
                        multiline
                        rows={3}
                        {...field}
                        error={!!errors.observation}
                        helperText={errors.observation?.message}
                        fullWidth
                        sx={formTheme}
                    />
                )}
            />

            <Box className="w-[100%] flex flex-row justify-between gap-2">
                <Controller
                    name="approvalStatus"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={formTheme}>
                            <InputLabel>Status de Aprovação</InputLabel>
                            <Select
                                label="Status de Aprovação"
                                {...field}
                                error={!!errors.approvalStatus}
                            >
                                <MenuItem value="PENDING">Pendente</MenuItem>
                                <MenuItem value="APPROVED">Aprovado</MenuItem>
                                <MenuItem value="REJECTED">Rejeitado</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />

                <Controller
                    name="approvalDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Data de Aprovação"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            {...field}
                            error={!!errors.approvalDate}
                            helperText={errors.approvalDate?.message}
                            fullWidth
                            sx={formTheme}
                        />
                    )}
                />

                <Controller
                    name="approvalUpdatedByUserId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="ID do Aprovador"
                            type="number"
                            {...field}
                            error={!!errors.approvalUpdatedByUserId}
                            helperText={errors.approvalUpdatedByUserId?.message}
                            fullWidth
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Box className="border-t pt-4 mt-4 flex flex-col gap-5">
                <h3 className="text-lg font-medium mb-4 text-[#5E5873]">Justificativa</h3>

                <Controller
                    name="justification.reason"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Motivo"
                            {...field}
                            error={!!errors.justification?.reason}
                            helperText={errors.justification?.reason?.message}
                            className="w-[100%] mb-4"
                            sx={formTheme}
                        />
                    )}
                />

                <Controller
                    name="justification.description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Descrição"
                            multiline
                            rows={3}
                            {...field}
                            error={!!errors.justification?.description}
                            helperText={errors.justification?.description?.message}
                            className="w-[100%] mb-4"
                            sx={formTheme}
                        />
                    )}
                />

                <Box className="flex gap-4">
                    <Controller
                        name="justification.justifiedByUserId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="ID do Justificador"
                                type="number"
                                {...field}
                                error={!!errors.justification?.justifiedByUserId}
                                helperText={errors.justification?.justifiedByUserId?.message}
                                fullWidth
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="justification.isInternal"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth sx={formTheme}>
                                <InputLabel>É interno?</InputLabel>
                                <Select
                                    label="É interno?"
                                    {...field}
                                    error={!!errors.justification?.isInternal}
                                >
                                    <MenuItem value="true">Sim</MenuItem>
                                    <MenuItem value="false">Não</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>

                <Controller
                    name="justification.transcription"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            variant="outlined"
                            label="Transcrição"
                            multiline
                            rows={3}
                            {...field}
                            error={!!errors.justification?.transcription}
                            helperText={errors.justification?.transcription?.message}
                            className="w-[100%] mt-4"
                            sx={formTheme}
                        />
                    )}
                />
            </Box>

            <Box className="flex flex-row justify-end gap-4">
                <Button variant="outlined" sx={buttonThemeNoBackground} >Cancelar</Button>
                <Button variant="outlined" type="submit" sx={[buttonTheme, { alignSelf: "end" }]}>Cadastrar</Button>
            </Box>
        </form>
    );
}