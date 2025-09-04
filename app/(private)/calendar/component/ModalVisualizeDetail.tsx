import { Box, IconButton, Modal } from "@mui/material";
import { IoMdClose } from "react-icons/io";

function DetailItem({ label, value }: { label: string; value: string | number }) {
    return (
        <Box className="flex flex-col w-[100%]">
            <Box className="text-sm font-semibold text-[#4B5563]">{label}</Box>
            <Box className="text-sm text-[#6E6B7B]">
                {value !== null && value !== undefined ? value : "-"}
            </Box>
        </Box>
    );
}

export default function ModalVisualizeDetail({
    modalVisualize,
    handleChangeModalVisualize,
}: {
    modalVisualize: any | null;
    handleChangeModalVisualize: (val: any | null) => void;
}) {
    return (
        <Modal
            open={modalVisualize !== null}
            onClose={() => handleChangeModalVisualize(null)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="flex items-center justify-center"
        >
            <Box className="bg-white shadow-xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto  p-6 relative">
                {/* Botão fechar */}
                {/* <IconButton
                    aria-label="fechar"
                    size="small"
                    onClick={() => handleChangeModalVisualize(null)}
                    className="absolute top-4 right-4 hover:bg-gray-100"
                >
                    <IoMdClose size={20} className="text-gray-500" />
                </IconButton> */}



                {/* Título */}
                <h2 id="modal-title" className="text-[#374151] text-[1.4rem] font-bold mb-6">
                    Detalhes da Atividade
                </h2>

                {/* Dados principais */}
                <Box className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <Box className="flex flex-row gap-3 mb-3">
                        <DetailItem label="ID:" value={`#${modalVisualize?.id}`} />
                        <DetailItem label="Ambiente:" value={modalVisualize?.environment} />
                    </Box>
                    <Box className="flex flex-row gap-3 mb-3">
                        <DetailItem label="Dimensão (m²):" value={modalVisualize?.dimension} />
                        <DetailItem label="Data:" value={modalVisualize?.dateTime} />
                    </Box>
                    <Box className="flex flex-row gap-3 mb-3">
                        <DetailItem label="Supervisor:" value={modalVisualize?.supervisor} />
                        <DetailItem label="Gerente:" value={modalVisualize?.manager} />
                    </Box>

                    <Box className="px-3 py-2 mb-5 rounded-md font-medium text-white inline-block" style={{ color: modalVisualize?.approvalStatus?.color, borderWidth: 1, borderColor: modalVisualize?.approvalStatus?.color, borderRadius: '100px', padding: '3px 8px' }} >
                        {modalVisualize?.approvalStatus?.title}
                    </Box>
                </Box>


            </Box>
        </Modal >
    );
}
