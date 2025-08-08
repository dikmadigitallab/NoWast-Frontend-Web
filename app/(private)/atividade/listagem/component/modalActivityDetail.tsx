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
                                <Box className="font-semibold text-[#6E6B7B]">Ambiente:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.environment}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Dimensão:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.dimension}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Supervisor:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.supervisor}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-row gap-3">
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Gestor:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.manager}</Box>
                            </Box>
                            <Box className="flex flex-col w-[50%]">
                                <Box className="font-semibold text-[#6E6B7B]">Data:</Box>
                                <Box className="text-[#6E6B7B]">{modalVisualize?.dateTime}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-col">
                            <Box className="font-semibold text-[#6E6B7B]">Aprovação:</Box>
                            <Box className="text-[#6E6B7B]">{modalVisualize?.approvalStatus}</Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

