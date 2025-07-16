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
            <Box className="absolute top-0 right-0 w-[600px] h-full bg-white z-10 overflow-y-auto">
                <Box className="px-5">

                    <Box className="flex justify-between items-center h-[45px] border-b border-[#E0E0E0]">
                        <h2 className="text-[#6E6B7B] text-[1.2rem] font-semibold">Detalhes do Ambiente</h2>
                        <IconButton aria-label="fechar" size="small" onClick={() => handleChangeModalVisualize(null)}>
                            <IoMdClose />
                        </IconButton>
                    </Box>

                    <Box className="mt-3 flex flex-col gap-3">

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">ID:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.id}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.nome}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Raio:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.raio}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Serviço:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.servico}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-col">
                            <Box className="font-semibold text-[#6E6B7B]">Tipo:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.tipo}</Box>
                        </Box>
                        <Box className="flex flex-col">
                            <Box className="font-semibold text-[#6E6B7B]">Descrição:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.descricao}</Box>
                        </Box>

                        <Box className="flex flex-col">
                            <Box className="font-semibold text-[#6E6B7B]">Checklist:</Box>
                            <Box className="text-[#6E6B7B] flex flex-col gap-1 mt-1">
                                {modalVisualize?.checklist?.map((item: string, index: number) => (
                                    <Box key={index}>• {item}</Box>
                                ))}
                            </Box>
                        </Box>

                        <Box className="mt-4 border-t border-[#E0E0E0] pt-3">
                            <Box className="font-semibold text-[#6E6B7B] mb-2">Setor:</Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.setor?.nome}</Box>
                            </Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Descrição:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.setor?.descricao}</Box>
                            </Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Dimensão:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.setor?.dimensao}</Box>
                            </Box>
                        </Box>

                        <Box className="mt-4 border-t border-[#E0E0E0] pt-3">
                            <Box className="font-semibold text-[#6E6B7B] mb-2">Prédio:</Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.predio?.nome}</Box>
                            </Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Descrição:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.predio?.descricao}</Box>
                            </Box>
                            <Box className="flex flex-col">
                                <Box className="font-semibold text-[#6E6B7B]">Raio:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.predio?.raio}</Box>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
