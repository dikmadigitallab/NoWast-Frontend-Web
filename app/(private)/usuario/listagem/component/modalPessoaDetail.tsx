import { Box, IconButton, Modal, Chip } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function DetailModal({ modalDetail, handleChangeModalDetail }: any) {
    if (!modalDetail) return null;

    const {
        id,
        name,
        tradeName,
        document,
        briefDescription,
        birthDate,
        gender,
        personType,
        createdAt,
        updatedAt,
        emails = [],
        phones = [],
        addresses = [],
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
                        <h2 className="text-[#6E6B7B] text-[1.2rem] font-semibold">Detalhes da Empresa</h2>
                        <IconButton aria-label="fechar" size="small" onClick={() => handleChangeModalDetail(null)}>
                            <IoMdClose />
                        </IconButton>
                    </Box>

                    <Box className="mt-3 flex flex-col gap-3">
                        <Box className="flex flex-row gap-8">
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">ID#:</Box>
                                <Box className="font-normal text-[#6E6B7B]">{id}</Box>
                            </Box>
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">Razão Social:</Box>
                                <Box className="font-normal text-[#6E6B7B]">{name}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Nome Fantasia:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{tradeName}</Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">CNPJ:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{document}</Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Descrição:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{briefDescription}</Box>
                        </Box>

                        <Box className="flex flex-row gap-8">
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">Data de Fundação:</Box>
                                <Box className="font-normal text-[#6E6B7B]">
                                    {birthDate ? new Date(birthDate).toLocaleDateString() : "--"}
                                </Box>
                            </Box>

                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">Tipo de Pessoa:</Box>
                                <Box className="font-normal text-[#6E6B7B]">{personType}</Box>
                            </Box>
                        </Box>

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Gênero:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{gender}</Box>
                        </Box>

                        {emails.length > 0 && (
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">E-mails:</Box>
                                <Box className="flex flex-wrap gap-2">
                                    {emails.map((email: any) => (
                                        <Chip
                                            key={email.id}
                                            label={email.email}
                                            color={email.isDefault ? "primary" : "default"}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {phones.length > 0 && (
                            <Box className="flex flex-col mt-1">
                                <Box className="font-semibold text-[#6E6B7B]">Telefones:</Box>
                                <Box className="flex flex-wrap gap-2">
                                    {phones.map((phone: any) => (
                                        <Chip
                                            key={phone.id}
                                            label={phone.phoneNumber}
                                            color={phone.isDefault ? "primary" : "default"}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box className="flex flex-col mt-1">
                            <Box className="font-semibold text-[#6E6B7B]">Criado em:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(createdAt).toLocaleString()}</Box>
                        </Box>

                        <Box className="flex flex-col mt-1 mb-4">
                            <Box className="font-semibold text-[#6E6B7B]">Atualizado em:</Box>
                            <Box className="font-normal text-[#6E6B7B]">{new Date(updatedAt).toLocaleString()}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
