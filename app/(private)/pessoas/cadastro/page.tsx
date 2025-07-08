"use client";

import { z } from "zod";
import { TextField, MenuItem, Checkbox, ListItemText, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText } from "@mui/material";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledMainContainer } from "@/app/styles/container/container";
import { formTheme } from "@/app/styles/formTheme/theme";
import { IoMdClose } from 'react-icons/io';

import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import React from "react";

const userSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    cargo: z.string().min(1, "Cargo é obrigatório"),
    tipo_usuario: z.string().min(1, "Tipo de usuário é obrigatório"),
    encarregado_responsavel: z.string().min(1, "Encarregado responsável é obrigatório"),
    gestorResponsavel: z.string().min(1, "Gestor responsável é obrigatório"),
    data_inicio: z.string().min(1, "Data de início é obrigatória"),
    data_fim: z.string().min(1, "Data de fim é obrigatória"),
    localizacaoDeAtuacao: z.string().min(1, "Localizacao De Atuacao é obrigatório"),
    epi_responsabilidade: z.array(z.string()).min(1, "Pelo menos um EPI é obrigatório"),
    equipamento: z.array(z.string()).min(1, "Pelo menos um equipamento é obrigatório"),
    maquina: z.array(z.string()).min(1, "Pelo menos uma máquina é obrigatória"),
    produtos: z.array(z.string()).min(1, "Pelo menos um produto é obrigatório"),
    foto: z.any()
});

type UserFormValues = z.infer<typeof userSchema>;

export default function CadastroPessoas() {

    const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: "",
            nome: "",
            email: "",
            cargo: "",
            tipo_usuario: "",
            encarregado_responsavel: "",
            gestorResponsavel: "",
            data_inicio: "",
            data_fim: "",
            localizacaoDeAtuacao: "",
            epi_responsabilidade: [],
            equipamento: [],
            maquina: [],
            produtos: [],
            foto: null
        },
        mode: "onChange"
    });

    const epiOptions = ["Capacete", "Óculos", "Luvas", "Botas", "Protetor Auricular"];
    const equipamentoOptions = ["Furadeira", "Serra", "Martelo", "Chave de Fenda"];
    const maquinaOptions = ["Escavadeira", "Betoneira", "Guindaste", "Compactadora"];
    const produtoOptions = ["Cimento", "Tijolos", "Areia", "Argamassa"];

    const renderChips = (selected: string[], fieldName: string, onDelete: (value: string) => void) => (
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {selected.map((value) => (
                <Chip
                    key={value}
                    label={value}
                    onDelete={() => onDelete(value)}
                    deleteIcon={<IoMdClose onMouseDown={(event:React.MouseEvent) => event.stopPropagation()} />}
                />
            ))}
        </Box>
    );

    const onSubmit = (data: UserFormValues) => {
        console.log("Dados enviados:", data);
    };

    return (
        <StyledMainContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Box className="flex gap-2">
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoas</h1>
                    <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                    <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Cadastro</h1>
                </Box>
                <Box className="w-[100%] flex flex-row justify-between">
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="ID#"
                                {...field}
                                error={!!errors.id}
                                helperText={errors.id?.message}
                                className="w-[33%]"
                                sx={{
                                    ...formTheme,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#00000012",
                                        borderRadius: "5px"
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="nome"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Nome completo"
                                {...field}
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Email"
                                type="email"
                                {...field}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row justify-between">
                    <Controller
                        name="cargo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Cargo"
                                {...field}
                                error={!!errors.cargo}
                                helperText={errors.cargo?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />
                    <Controller
                        name="tipo_usuario"
                        control={control}
                        render={({ field, fieldState: { error: errorState } }) => (
                            <FormControl error={!!errorState} className="w-[33%]" sx={formTheme}>
                                <InputLabel id="tipo_usuario">Tipo de usuário</InputLabel>
                                <Select
                                    labelId="tipo_usuario"
                                    label="Tipo de usuário"
                                    {...field}
                                    className="w-[100%] rounded-[5px]"
                                >
                                    <MenuItem value="Administrador Dikma">Administrador Dikma</MenuItem>
                                    <MenuItem value="Administrador Cliente">Administrador Cliente</MenuItem>
                                    <MenuItem value="Operacional">Operacional</MenuItem>
                                </Select>
                                {errorState && <FormHelperText>{errorState?.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="encarregado_responsavel"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Encarregado responsável"
                                {...field}
                                error={!!errors.encarregado_responsavel}
                                helperText={errors.encarregado_responsavel?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row justify-between">

                    <Controller
                        name="gestorResponsavel"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Gestor responsável"
                                {...field}
                                error={!!errors.gestorResponsavel}
                                helperText={errors.gestorResponsavel?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="data_inicio"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Data de início"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.data_inicio}
                                helperText={errors.data_inicio?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <Controller
                        name="data_fim"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Data de fim"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!errors.data_fim}
                                helperText={errors.data_fim?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row justify-between">

                    <Controller
                        name="localizacaoDeAtuacao"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                label="Localização de atuação"
                                type="text"
                                {...field}
                                error={!!errors.localizacaoDeAtuacao}
                                helperText={errors.localizacaoDeAtuacao?.message}
                                className="w-[33%]"
                                sx={formTheme}
                            />
                        )}
                    />

                    <FormControl sx={formTheme} className="w-[33%]  mb-5" error={!!errors.epi_responsabilidade}>
                        <InputLabel>EPI de responsabilidade</InputLabel>
                        <Controller
                            name="epi_responsabilidade"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    label="EPI de responsabilidade"
                                    input={<OutlinedInput label="EPI de responsabilidade" />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderValue={(selected) => renderChips(
                                        selected as string[],
                                        'epi_responsabilidade',
                                        (value) => field.onChange(field.value.filter((item) => item !== value))
                                    )}
                                >
                                    {epiOptions.map((epi) => (
                                        <MenuItem key={epi} value={epi}>
                                            <Checkbox checked={field.value.includes(epi)} />
                                            <ListItemText primary={epi} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.epi_responsabilidade && (
                            <p className="text-red-500 text-xs mt-1">{errors.epi_responsabilidade.message}</p>
                        )}
                    </FormControl>

                    <FormControl sx={formTheme} className="w-[33%]" error={!!errors.equipamento}>
                        <InputLabel>Equipamento</InputLabel>
                        <Controller
                            name="equipamento"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    label="Equipamento"
                                    input={<OutlinedInput label="Equipamento" />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderValue={(selected) => renderChips(
                                        selected as string[],
                                        'equipamento',
                                        (value) => field.onChange(field.value.filter((item) => item !== value))
                                    )}
                                >
                                    {equipamentoOptions.map((equip) => (
                                        <MenuItem key={equip} value={equip}>
                                            <Checkbox checked={field.value.includes(equip)} />
                                            <ListItemText primary={equip} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.equipamento && (
                            <p className="text-red-500 text-xs mt-1">{errors.equipamento.message}</p>
                        )}
                    </FormControl>

                </Box>


                <Box className="w-[100%] flex flex-row justify-between">

                    <FormControl sx={formTheme} className="w-[33%]" error={!!errors.maquina}>
                        <InputLabel>Máquina</InputLabel>
                        <Controller
                            name="maquina"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    label="Máquina"
                                    input={<OutlinedInput label="Máquina" />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderValue={(selected) => renderChips(
                                        selected as string[],
                                        'maquina',
                                        (value) => field.onChange(field.value.filter((item) => item !== value))
                                    )}
                                >
                                    {maquinaOptions.map((maq) => (
                                        <MenuItem key={maq} value={maq}>
                                            <Checkbox checked={field.value.includes(maq)} />
                                            <ListItemText primary={maq} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.maquina && (
                            <p className="text-red-500 text-xs mt-1">{errors.maquina.message}</p>
                        )}
                    </FormControl>

                    {/* Produtos */}
                    <FormControl sx={formTheme} className="w-[33%]" error={!!errors.produtos}>
                        <InputLabel>Produtos</InputLabel>
                        <Controller
                            name="produtos"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    multiple
                                    label="Produtos"
                                    input={<OutlinedInput label="Produtos" />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderValue={(selected) => renderChips(
                                        selected as string[],
                                        'produtos',
                                        (value) => field.onChange(field.value.filter((item) => item !== value))
                                    )}
                                >
                                    {produtoOptions.map((prod) => (
                                        <MenuItem key={prod} value={prod}>
                                            <Checkbox checked={field.value.includes(prod)} />
                                            <ListItemText primary={prod} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.produtos && (
                            <p className="text-red-500 text-xs mt-1">{errors.produtos.message}</p>
                        )}
                    </FormControl>

                    <Controller
                        name="foto"
                        control={control}
                        render={({ field }) => (
                            <Box className="w-[33%] flex items-center" sx={[formTheme, { border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }]}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                    className="mt-2"
                                    style={{ display: 'none' }}
                                    id="upload-file"
                                />
                                <label htmlFor="upload-file" className="w-[100%]">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Box className="ml-2">{field.value?.name || "Selecionar uma foto do usuário"}</Box>
                                        {field.value && (
                                            <Box className="mr-2">
                                                <IoMdClose
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        field.onChange(null);
                                                    }}
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </label>
                            </Box>
                        )}
                    />
                </Box>

                <Box className="w-[100%] flex flex-row gap-5 justify-end">
                    <Button
                        variant="outlined"
                        sx={buttonThemeNoBackground}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={[buttonTheme, { alignSelf: "end" }]}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </form>
        </StyledMainContainer>
    )
}