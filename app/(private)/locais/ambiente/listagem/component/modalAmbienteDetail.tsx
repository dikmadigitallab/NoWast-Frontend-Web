import { Box, IconButton, Modal, Paper, Collapse, Typography, Chip } from "@mui/material";
import { IoMdClose, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState, useEffect } from "react";
import { useGet } from "@/app/hooks/crud/get/useGet";
import { useGetOneById } from "@/app/hooks/crud/getOneById/useGetOneById";
import { useGetIDStore } from "@/app/store/getIDStore";

function DetailItem({ label, value }: { label: string; value: string | number }) {
    return (
        <Box className="flex flex-col w-[100%]">
            <Box className="text-sm font-semibold text-[#4B5563]">{label}</Box>
            <Box className="text-sm text-[#6E6B7B]">{value !== null && value !== undefined ? value : "-"}</Box>
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
                                <DetailItem label="Raio (m²):" value={item.areaM2} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

function ChecklistSection({ servicos }: { servicos: any[] }) {
    const [isOpen, setIsOpen] = useState(true); // Já aberto por padrão
    const [serviceChecklists, setServiceChecklists] = useState<{[key: number]: any[]}>({});
    const [loadingServices, setLoadingServices] = useState<{[key: number]: boolean}>({});
    const { setId } = useGetIDStore();
    const { data: serviceData, loading: serviceLoading } = useGetOneById("service");

    console.log(serviceData);

    // Buscar checklists de cada serviço quando o modal é aberto
    useEffect(() => {
        if (servicos && servicos.length > 0) {
            servicos.forEach((service: any) => {
                if (!serviceChecklists[service.id] && !loadingServices[service.id]) {
                    setLoadingServices(prev => ({ ...prev, [service.id]: true }));
                    setId(service.id);
                }
            });
        }
    }, [servicos]);

    // Atualizar checklists quando os dados do serviço chegam
    useEffect(() => {
        if (serviceData && serviceData.serviceItems) {
            const serviceId = serviceData.id;
            setServiceChecklists(prev => ({
                ...prev,
                [serviceId]: serviceData.serviceItems || []
            }));
            setLoadingServices(prev => ({
                ...prev,
                [serviceId]: false
            }));
        }
    }, [serviceData]);

    if (!servicos || servicos.length === 0) {
        return (
            <Box className="mt-6 border-b border-gray-200 pb-4 last:border-0">
                <Box className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <h2 className="text-[#374151] text-[1.1rem] font-semibold">Checklist (Serviços)</h2>
                    <IconButton size="small" className="text-gray-500">{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</IconButton>
                </Box>
                <Collapse in={isOpen}>
                    <Box className="mt-3 p-4 text-center">
                        <Typography variant="body2" color="text.secondary">Nenhum serviço cadastrado para este ambiente</Typography>
                    </Box>
                </Collapse>
            </Box>
        );
    }

    return (
        <Box className="mt-6 border-b border-gray-200 pb-4 last:border-0">
            <Box className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-[#374151] text-[1.1rem] font-semibold">Checklist (Serviços) - {servicos.length} item(s)</h2>
                <IconButton size="small" className="text-gray-500">{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</IconButton>
            </Box>
            <Collapse in={isOpen}>
                <Box className="mt-3 space-y-4">
                    {servicos.map((service: any) => (
                        <Box key={service.id} className="border border-gray-200 rounded-lg p-4">
                            <Box className="flex items-center gap-2 mb-3">
                                <Typography variant="h6" className="text-[#374151] font-semibold">
                                    {service.name}
                                </Typography>
                                {loadingServices[service.id] && (
                                    <Typography variant="body2" color="text.secondary">
                                        Carregando checklists...
                                    </Typography>
                                )}
                            </Box>
                            
                            {serviceChecklists[service.id] && serviceChecklists[service.id].length > 0 ? (
                                <Box className="flex flex-wrap gap-2">
                                    {serviceChecklists[service.id].map((checklist: any) => (
                                        <Chip
                                            key={checklist.id}
                                            label={checklist.name}
                                            sx={{
                                                backgroundColor: '#00B288',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '.8rem',
                                                fontWeight: '500',
                                                '&:hover': {
                                                    backgroundColor: '#00755a',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            ) : !loadingServices[service.id] ? (
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum checklist cadastrado para este serviço
                                </Typography>
                            ) : null}
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

export default function ModalVisualizeDetail({ modalVisualize, handleChangeModalVisualize }: any) {
    //console.log(modalVisualize);

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
                            Detalhes do Ambiente
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
                            <DetailItem label="Nome:" value={modalVisualize?.name} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Descrição:" value={modalVisualize?.description} />
                            <DetailItem label="Area (m²):" value={modalVisualize?.areaM2} />
                        </Box>
                        <Box className="flex flex-row gap-3 mb-3">
                            <DetailItem label="Setor:" value={modalVisualize?.setor?.name} />
                            <DetailItem label="Prédio:" value={modalVisualize?.predio?.name} />
                        </Box>
                    </Box>

                    <Box className="space-y-6">
                        <ChecklistSection servicos={modalVisualize?.servicos || []} />
                        <CollapsibleSection title="Setores" items={modalVisualize?.setor ? [modalVisualize.setor] : []} />
                        <CollapsibleSection title="Prédios" items={modalVisualize?.predio ? [modalVisualize.predio] : []} />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
