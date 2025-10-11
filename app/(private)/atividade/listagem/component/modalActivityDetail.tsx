import { Box, IconButton, Modal, Paper, Collapse } from "@mui/material";
import { IoMdClose, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from "react";

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <Box className="flex flex-col w-[100%]">
            <Box className="text-sm font-semibold text-[#4B5563]">{label}</Box>
            <Box className="text-sm text-[#6E6B7B]">{value || "-"}</Box>
        </Box>
    );
}

function CollapsibleSection({ title, items }: { title: string; items: any[] }) {

    if (items.length === 0) return null;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="mt-6 border-b border-gray-200 pb-4 last:border-0">
            <Box className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-[#374151] text-[1.1rem] font-semibold">{title}</h2>
                <IconButton size="small" className="text-gray-500">{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</IconButton>
            </Box>
            <Collapse in={isOpen}>
                <Box className="grid gap-3 mt-3">
                    {items.map((item) => (
                        <Box key={item.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <Box className="flex flex-col gap-3">
                                <DetailItem label="Nome:" value={item.name} />
                                <DetailItem label="Descrição:" value={item.description} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

export default function ModalVisualizeDetail({ modalVisualize, handleChangeModalVisualize }: any) {

    console.log(modalVisualize);
    return (
        <Modal
            open={modalVisualize !== null}
            onClose={() => handleChangeModalVisualize(null)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-0 right-0 w-[600px] h-full bg-white shadow-xl z-10 overflow-y-auto">
                <Box className="px-6 pb-8">

                    <Box className="flex justify-between items-center h-[60px] border-b border-gray-200 mb-6 sticky top-0 bg-white z-10">
                        <h2 className="text-[#374151] text-[1.4rem] font-bold">
                            Detalhes da Atividade
                        </h2>
                        <IconButton
                            aria-label="fechar"
                            size="small"
                            onClick={() => handleChangeModalVisualize(null)}
                            className="hover:bg-gray-100"
                        >
                            <IoMdClose size={20} className="text-gray-500" />
                        </IconButton>
                    </Box>

                    <Box className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="ID:" value={`#${modalVisualize?.id}`} />
                            <DetailItem label="Ambiente:" value={modalVisualize?.environment} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Dimensão:" value={modalVisualize?.dimension} />
                            <DetailItem label="Supervisor:" value={modalVisualize?.supervisor} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Gestor:" value={modalVisualize?.manager} />
                            <DetailItem label="Data:" value={modalVisualize?.dateTime} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Setor:" value={modalVisualize?.environmentDetail?.sector?.name} />
                            <DetailItem label="Prédio:" value={modalVisualize?.environmentDetail?.building?.name} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Descrição:" value={modalVisualize?.description} />
                        </Box>
                        <Box className="flex items-center gap-2">
                            <Box className="text-sm font-semibold text-[#4B5563]">Status:</Box>
                            {modalVisualize?.statusEnum && <Box sx={{ color: modalVisualize.statusEnum.color, borderWidth: 1, borderColor: modalVisualize.statusEnum.color, borderRadius: '100px', padding: '3px 8px' }}>{modalVisualize.statusEnum.title}</Box>}
                        </Box>
                        <Box className="flex items-center gap-2 mt-2">
                            <Box className="text-sm font-semibold text-[#4B5563]">Aprovação:</Box>
                            {modalVisualize?.approvalStatus && <Box sx={{ color: modalVisualize.approvalStatus.color, borderWidth: 1, borderColor: modalVisualize.approvalStatus.color, borderRadius: '100px', padding: '3px 8px' }}>{modalVisualize.approvalStatus.title}</Box>}
                            {modalVisualize?.approvalDate && <Box className="text-sm text-[#6E6B7B]">em {modalVisualize.approvalDate}</Box>}
                            {modalVisualize?.approvalUpdatedByUserName && <Box className="text-sm text-[#6E6B7B]">por {modalVisualize.approvalUpdatedByUserName}</Box>}
                        </Box>
                    </Box>

                    <Box className="space-y-6">
                        {/* Participantes Ativos */}
                        {Array.isArray(modalVisualize?.participantsActive) && modalVisualize.participantsActive.length > 0 && (
                            <Box className="mt-6 border-b border-gray-200 pb-4">
                                <h2 className="text-[#374151] text-[1.1rem] font-semibold">Participantes Ativos</h2>
                                <Box className="grid gap-2 mt-3">
                                    {modalVisualize.participantsActive.map((p: any) => (
                                        <Box key={p.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                                            <Box className="text-sm text-[#374151]">{p.name}</Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Checklists */}
                        {Array.isArray(modalVisualize?.checklists) && modalVisualize.checklists.length > 0 && (
                            <Box className="mt-6 border-b border-gray-200 pb-4">
                                <h2 className="text-[#374151] text-[1.1rem] font-semibold">Checklists</h2>
                                <Box className="grid gap-3 mt-3">
                                    {modalVisualize.checklists.map((c: any) => (
                                        <Box key={c.id} className="p-4 rounded-lg border border-gray-200">
                                            <Box className="flex flex-col gap-2">
                                                <DetailItem label="Serviço:" value={c?.serviceItem?.service?.name} />
                                                <DetailItem label="Tipo de Serviço:" value={c?.serviceItem?.service?.serviceType?.name} />
                                                <DetailItem label="Item:" value={c?.serviceItem?.name} />
                                                <DetailItem label="Concluído:" value={c?.isComplete ? 'Sim' : 'Não'} />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <CollapsibleSection title="EPIs" items={modalVisualize?.ppe || []} />
                        <CollapsibleSection title="Produtos" items={modalVisualize?.products || []} />
                        <CollapsibleSection title="Ferramentas" items={modalVisualize?.tools || []} />
                        <CollapsibleSection title="Transportes" items={modalVisualize?.transports || []} />

                        {/* Imagens/Arquivos */}
                        {Array.isArray(modalVisualize?.activityFiles) && modalVisualize.activityFiles.length > 0 && (
                            <Box className="mt-6 border-b border-gray-200 pb-4 last:border-0">
                                <h2 className="text-[#374151] text-[1.1rem] font-semibold">Imagens e Arquivos</h2>
                                <Box className="grid grid-cols-2 gap-3 mt-3">
                                    {modalVisualize.activityFiles.map((activityFile: any) => (
                                        <Box key={activityFile.id} className="p-2 rounded-lg border border-gray-200">
                                            {activityFile.file?.url ? (
                                                <div className="flex flex-col gap-2">
                                                    <img 
                                                        src={activityFile.file.url} 
                                                        alt={activityFile.file.fileName || 'arquivo'} 
                                                        className="w-full h-32 object-cover rounded" 
                                                    />
                                                    <Box className="text-xs text-[#6E6B7B]">
                                                        {activityFile.file.fileName}
                                                    </Box>
                                                    <Box className="text-xs text-[#6E6B7B]">
                                                        Tipo: {activityFile.fileType}
                                                    </Box>
                                                </div>
                                            ) : (
                                                <Box className="text-sm text-[#6E6B7B]">
                                                    {activityFile.file?.fileName || 'Arquivo'}
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}