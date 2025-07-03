import { z } from "zod";
import { useEffect } from "react";
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTheme } from "@/app/styles/formTheme/theme";
import { buttonTheme, buttonThemeNoBackground } from "@/app/styles/buttonTheme/theme";
import { TextField, MenuItem, Checkbox, ListItemText, InputLabel, Select, FormControl, Button, Chip, OutlinedInput, Box, FormHelperText } from "@mui/material";

const pessoaSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    tipo_usuario: z.string().min(1, "Tipo de usuário é obrigatório"),
    cargo: z.string().min(1, "Cargo é obrigatório"),
    encarregado: z.string().min(1, "Encarregado responsável é obrigatório"),
    gestor: z.string().min(1, "Gestor responsável é obrigatório"),
    status: z.string().min(1, "Status é obrigatório"),
    localizacao: z.string().min(1, "Localizacao De Atuacao é obrigatório"),
    data_inicio: z.string().min(1, "Data de início é obrigatória"),
    data_fim: z.string().min(1, "Data de fim é obrigatória"),
    epi_responsabilidade: z.array(z.string()).min(1, "Pelo menos um EPI é obrigatório"),
    equipamento: z.array(z.string()).min(1, "Pelo menos um equipamento é obrigatório"),
    maquina: z.array(z.string()).min(1, "Pelo menos uma máquina é obrigatória"),
    produtos: z.array(z.string()).min(1, "Pelo menos um produto é obrigatório"),
    foto: z.any()
});

type PessoaFormValues = z.infer<typeof pessoaSchema>;


export default function ModalPessoaEditModal({ modalEdit, handleChangeModalEdit, edit }: any) {

    console.log("Edit Data:", edit);

    const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<PessoaFormValues>({
        resolver: zodResolver(pessoaSchema),
        defaultValues: {
            id: "",
            nome: "",
            email: "",
            tipo_usuario: "",
            cargo: "",
            encarregado: "",
            status: "",
            gestor: "",
            localizacao: "",
            data_inicio: "",
            data_fim: "",
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
                    deleteIcon={<IoMdClose onMouseDown={(event) => event.stopPropagation()} />}
                />
            ))}
        </Box>
    );

    useEffect(() => {
        if (edit && modalEdit) {
            reset({
                id: edit.id,
                nome: edit.name,
                email: edit.email,
                tipo_usuario: edit.tipo_usuario,
                cargo: edit.cargo,
                encarregado: edit.encarregado,
                gestor: edit.gestor,
                status: edit.status,
                localizacao: edit.localizacao,
                data_inicio: edit.data_inicio,
                data_fim: edit.data_fim,
                epi_responsabilidade: edit.epi_responsabilidade,
                equipamento: edit.equipamento,
                maquina: edit.maquina,
                produtos: edit.produtos
            })
        }
    }, [edit])

    return (
        <Box>
            <Modal
                open={modalEdit}
                onClose={() => handleChangeModalEdit(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] bg-white rounded-lg p-4 justify-between flex flex-col overflow-y-auto">
                    <Box className="flex flex-col gap-5">
                        <Box className="flex gap-2">
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">Pessoas</h1>
                            <h1 className="text-[#B9B9C3] text-[1.4rem] font-normal">/</h1>
                            <h1 className="text-[#5E5873] text-[1.4rem] font-normal">Edição</h1>
                        </Box>

                        <Box className="w-full flex flex-row justify-between">
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
                                                borderRadius: "10px"
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

                        <Box className="w-full flex flex-row justify-between">
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
                                            className="w-[100%] rounded-[10px]"
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
                                name="encarregado"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Encarregado responsável"
                                        {...field}
                                        error={!!errors.encarregado}
                                        helperText={errors.encarregado?.message}
                                        className="w-[33%]"
                                        sx={formTheme}
                                    />
                                )}
                            />
                        </Box>

                        <Box className="w-full flex flex-row justify-between">

                            <Controller
                                name="gestor"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Gestor responsável"
                                        {...field}
                                        error={!!errors.gestor}
                                        helperText={errors.gestor?.message}
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


                        <Box className="w-full flex flex-row justify-between">

                            <Controller
                                name="localizacao"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        label="Localização de atuação"
                                        type="text"
                                        {...field}
                                        error={!!errors.localizacao}
                                        helperText={errors.localizacao?.message}
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
                                                (value) => field.onChange(field?.value?.filter((item) => item !== value))
                                            )}
                                        >
                                            {epiOptions.map((epi) => (
                                                <MenuItem key={epi} value={epi}>
                                                    <Checkbox checked={field?.value?.includes(epi)} />
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
                                                (value) => field.onChange(field?.value?.filter((item) => item !== value))
                                            )}
                                        >
                                            {equipamentoOptions.map((equip) => (
                                                <MenuItem key={equip} value={equip}>
                                                    <Checkbox checked={field?.value?.includes(equip)} />
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


                        <Box className="w-full flex flex-row justify-between">
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
                                                (value) => field.onChange(field?.value?.filter((item) => item !== value))
                                            )}
                                        >
                                            {maquinaOptions.map((maq) => (
                                                <MenuItem key={maq} value={maq}>
                                                    <Checkbox checked={field?.value?.includes(maq)} />
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
                                                (value) => field.onChange(field?.value?.filter((item) => item !== value))
                                            )}
                                        >
                                            {produtoOptions.map((prod) => (
                                                <MenuItem key={prod} value={prod}>
                                                    <Checkbox checked={field?.value?.includes(prod)} />
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
                                        <label htmlFor="upload-file" className="w-full">
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

                            {/* {errors.foto && (
                                    <p className="text-red-500 text-xs mt-1">{errors.foto.message}</p>
                                )} */}
                        </Box>
                    </Box>

                    <Box className="w-full flex flex-row gap-5 justify-between items-center">
                        <Button
                            onClick={() => handleChangeModalEdit(null)}
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
                            Salvar
                        </Button>
                    </Box>
                </Box>

            </Modal>
        </Box>
    );
}