import { Box, Chip, IconButton, Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function ModalVisualizeDetail({ modalVisualize, handleChangeModalVisualize }: any) {
    return (
        <Modal
            open={modalVisualize !== null}
            onClose={() => handleChangeModalVisualize(null)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-0 right-0 w-[600px] h-full bg-white z-10 overflow-y-auto z-2">
                <Box className="px-5">

                    <Box className="flex justify-between items-center h-[45px] border-b border-[#E0E0E0]">
                        <h2 className="text-[#6E6B7B] text-[1.2rem] font-semibold">Detalheres da Pessoas</h2>
                        <IconButton aria-label="fechar" size="small" onClick={() => handleChangeModalVisualize(null)}>
                            <IoMdClose />
                        </IconButton>
                    </Box>

                    <Box className="mt-3 flex flex-col gap-3">
                        <Box className="w-[100%] h-[250px] bg-[#E0E0E0] rounded-md overflow-hidden border border-[#E0E0E0]">
                            <img src={modalVisualize?.foto} alt={modalVisualize?.nome} className="w-full h-full object-cover object-top" />
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.nome}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Email:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.email}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Usuário:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.usuario}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Cargo:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.cargo}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Encarregado Responsável:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.encarregado_responsavel}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Gestor Responsável:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.gestor_responsavel}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Localização de atuação:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.localizacao}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Data de Início:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.data_inicio}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Status:</Box>
                            <Box>
                                <Chip
                                    label={modalVisualize?.status}
                                    color={modalVisualize?.status === 'ativo' ? 'success' : 'error'}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );

}
