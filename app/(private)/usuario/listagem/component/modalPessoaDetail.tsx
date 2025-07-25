import { Box, IconButton, Modal, Chip } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function DetailModal({ modalDetail, handleChangeModalDetail }: any) {
    if (!modalDetail) return null;

    const {
        id,
        name,
        email,
        status,
        role,
        position,
    } = modalDetail;

    return (
        <Modal
            open={!!modalDetail}
            onClose={() => handleChangeModalDetail(null)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-0 right-0 w-[600px] h-full bg-white z-10 overflow-y-auto">
                <Box className="px-5">
                    <Box className="flex justify-between items-center h-[45px] border-b border-[#E0E0E0]">
                        <h2 className="text-[#6E6B7B] text-[1.2rem] font-semibold">Detalhes do Usuário</h2>
                        <IconButton aria-label="fechar" size="small" onClick={() => handleChangeModalDetail(null)}>
                            <IoMdClose />
                        </IconButton>
                    </Box>
                    <Box className="mt-3 flex flex-col gap-3">
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Nome:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{name}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">E-mail:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{email}</Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Tipo de Usuário:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{role}</Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Status:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{status}</Box>
                        </Box>


                        <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Posição:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{position}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

