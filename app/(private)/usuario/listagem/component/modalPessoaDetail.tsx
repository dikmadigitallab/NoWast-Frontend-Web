import { Box, IconButton, Modal, Chip } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function DetailModal({ modalDetail, handleChangeModalDetail }: any) {
    if (!modalDetail) return null;

    const { id, name, email, status, role, position, supervisor, manager, startDate, endDate, epis, transports, products, img } = modalDetail;

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
                        <Box className="w-full h-[300px] rounded-2xl overflow-hidden">
                            <img src={img} alt="User" className="w-full h-full object-contain object-top" />
                        </Box>
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
                            <Box className="font-semibold text-[#6E6B7B]">Cargo:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{position}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Encarregado Responsável:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{supervisor}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Gestor Responsável:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{manager}</Box>
                        </Box>
                        <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Data de Início:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(startDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' })}</Box>
                        </Box>

                        {endDate && <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Data de Fim:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(endDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' })}</Box>
                        </Box>}

                        {epis.length > 0 &&
                            <Box className="flex flex-col mt-1 mb-4">
                                <Box className="font-semibold text-[#6E6B7B]">EPIs de Responsabilidade:</Box>
                                <Box className="flex flex-wrap gap-2">
                                    {epis.map((epi: any) => (<Box key={epi.id} className="font-normal text-[#6E6B7B] border border-[#6E6B7B] rounded-md px-2">{epi.name}</Box>))}
                                </Box>
                            </Box>
                        }
                        {transports.length > 0 &&
                            <Box className="flex flex-col mt-1 mb-4">
                                <Box className="font-semibold text-[#6E6B7B]">Transportes de Responsabilidade:</Box>
                                <Box className="flex flex-wrap gap-2">
                                    {transports.map((transports: any) => (<Box key={transports.id} className="font-normal text-[#6E6B7B] border border-[#6E6B7B] rounded-md px-2">{transports.name}</Box>))}
                                </Box>
                            </Box>
                        }
                        {products.length > 0 &&
                            <Box className="flex flex-col mt-1 mb-4">
                                <Box className="font-semibold text-[#6E6B7B]">Produtos de Responsabilidade:</Box>
                                <Box className="flex flex-wrap gap-2">
                                    {products.map((products: any) => (<Box key={products.id} className="font-normal text-[#6E6B7B] border border-[#6E6B7B] rounded-md px-2">{products.name}</Box>))}
                                </Box>
                            </Box>
                        }
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

