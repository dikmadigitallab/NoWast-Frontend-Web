import { Box, Chip, IconButton, Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function DetailModal({ modalDetail, handleChangeModalDetail }: any) {
    return (
        <Modal
            open={modalDetail !== null}
            onClose={() => handleChangeModalDetail(null)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-0 right-0 w-[600px] h-full bg-white z-10 overflow-y-auto z-2">
                <Box className="px-5">

                    <Box className="flex justify-between items-center h-[45px] border-b border-[#E0E0E0]">
                        <h2 className="text-[#6E6B7B] text-[1.2rem] font-semibold">Detalhes de EPI </h2>
                        <IconButton aria-label="fechar" size="small" onClick={() => handleChangeModalDetail(null)}>
                            <IoMdClose />
                        </IconButton>
                    </Box>

                    <Box className="mt-3 flex flex-col gap-3">
                        <Box className="w-[100%] h-[250px] bg-[#E0E0E0] rounded-md overflow-hidden border border-[#E0E0E0]">
                            <img src={modalDetail?.foto} alt={modalDetail?.name} className="w-[100%] h-full object-contain" />
                        </Box>
                        <Box className="flex flex-row gap-8">
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">ID#:</Box>
                                <Box className="font-normal text-[#6E6B7B]">{modalDetail?.id}</Box>
                            </Box>
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                                <Box className="font-normal text-[#6E6B7B]">{modalDetail?.name}</Box>
                            </Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Descrição:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{modalDetail?.description}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Encarregado Responsável:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{modalDetail?.responsibleManagerId}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Criado em:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(modalDetail?.createdAt).toLocaleString()}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Atualizado em:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(modalDetail?.updatedAt).toLocaleString()}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

