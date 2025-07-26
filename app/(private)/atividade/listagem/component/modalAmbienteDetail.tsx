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
                                <Box className="font-semibold text-[#6E6B7B]">Setor:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.setor}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Prédio:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.predio}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Data:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.data}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Hora:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.hora}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Dimensão:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.dimensao}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Serviço:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.servico}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-col">
                            <Box className="font-semibold text-[#6E6B7B]">Tipo:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.Tipo}</Box>
                        </Box>

                       {/*  <Box className="mt-4 border-t border-[#E0E0E0] pt-3">
                            <Box className="font-semibold text-[#6E6B7B] mb-2">Pessoas:</Box>
                            <Box className="flex flex-col gap-5">
                                {modalVisualize?.pessoas?.map((pessoa: any, index: any) => (
                                    <Box key={index} className="border-b border-[#E0E0E0] pb-2">
                                        <Box><span className="font-semibold">Status:</span> {pessoa.status}</Box>
                                        <Box><span className="font-semibold">Encarregado:</span> {pessoa.encarregado}</Box>
                                        {pessoa.descricao && (
                                            <Box><span className="font-semibold">Descrição:</span> {pessoa.descricao}</Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box> */}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
