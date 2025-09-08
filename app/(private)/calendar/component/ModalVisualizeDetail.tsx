import { Box, Modal } from "@mui/material";
import { FaUserTie } from "react-icons/fa";

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

export default function ModalVisualizeDetail({ modalVisualize, handleChangeModalVisualize }: { modalVisualize: any | null; handleChangeModalVisualize: (val: any | null) => void }) {

    return (
        <Modal open={modalVisualize !== null} onClose={() => handleChangeModalVisualize(null)} aria-labelledby="modal-title" aria-describedby="modal-description" className="flex items-center justify-center">
            <Box className="bg-white shadow-xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto  p-6 relative">

                <h2 id="modal-title" className="text-[#374151] text-[1.4rem] font-bold mb-6">
                    Detalhes da Atividade
                </h2>

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
                    <Box className="flex flex-col gap-3 ">
                        <Box className="text-sm font-semibold text-[#4B5563]">Status:</Box>
                        <Box className="px-3 py-2 mb-5 rounded-md w-[fit-content] font-medium text-white inline-block" style={{ color: modalVisualize?.statusEnum?.color, borderWidth: 1, borderColor: modalVisualize?.statusEnum?.color, borderRadius: '100px', padding: '3px 8px' }} >
                            {modalVisualize?.statusEnum?.title}
                        </Box>
                    </Box>
                    <Box className="flex flex-col gap-3 ">
                        <Box className="text-sm font-semibold text-[#4B5563]">Aprovação:</Box>
                        <Box className="px-3 py-2 mb-5 rounded-md w-[fit-content] font-medium text-white inline-block" style={{ color: modalVisualize?.approvalStatus?.color, borderWidth: 1, borderColor: modalVisualize?.approvalStatus?.color, borderRadius: '100px', padding: '3px 8px' }} >
                            {modalVisualize?.approvalStatus?.title}
                        </Box>
                    </Box>
                    <Box className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 ">
                        <Box className="text-sm font-semibold text-[#4B5563] mb-3">Participantes:</Box>
                        {modalVisualize?.userActivities?.length > 0 ? (
                            <Box className="flex flex-col gap-2">
                                {modalVisualize.userActivities.map((item: any, index: number) => {
                                    console.log(item)
                                    return (
                                        <Box
                                            key={item.id}
                                            className={`flex h-[50px] flex-row justify-between items-center ${index !== modalVisualize.userActivities.length - 1 ? "border-b border-gray-200" : ""}`}
                                        >
                                            <Box className="flex flex-row gap-3 items-center">
                                                {modalVisualize?.file?.url ? (
                                                    <img src={modalVisualize?.file?.url} className="w-[40px] h-[40px] object-cover rounded-full" />
                                                ) :
                                                    <FaUserTie color="#a7a7a7" />
                                                }
                                                <Box className="text-sm text-[#374151]">
                                                    {item.user.person.name}
                                                </Box>
                                            </Box>
                                            <Box className="flex flex-row gap-2 items-center">
                                                <span className={`text-xs px-2 py-1 rounded-full ${item.justification === null ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                    {item.justification === null ? "Presente" : "Ausente"}
                                                </span>
                                                {item.justificationId && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
                                                        Justificado
                                                    </span>
                                                )}
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>
                        ) : (<Box className="text-sm text-[#6E6B7B]">Nenhum participante</Box>)}
                    </Box>

                </Box>
            </Box>
        </Modal >
    );
}
