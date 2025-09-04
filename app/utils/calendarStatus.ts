export const statusColors: Record<string, string> = {
    'Pendente': 'bg-[#FFA44D] border-[#FFA44D] text-white',
    'Concluído': 'bg-[#00A614] border-[#00A614] text-white',
    'Aberto': 'bg-[#2E97FC] border-[#2E97FC] text-white',
    'Aprovado': 'bg-[#00A614] border-[#00A614] text-white',
    'Rejeitado': 'bg-[#FF0000] border-[#FF0000] text-white',
    'Justificativa Interna': 'bg-[#FFA44D] border-[#FFA44D] text-white',
    'Justificativa Externa': 'bg-[#FFA44D] border-[#FFA44D] text-white',
    'Em Revisão': 'bg-[#ffd507] border-[#ffd507] text-black',
    'DEFAULT': 'bg-gray-100 border-gray-300 text-gray-600'
};

export const filterStatusCalendarActivity = (status: string): { title: string; color: string } => {
    console.log('Filtering status:', status); // Log do status recebido
    switch (status) {
        case 'Aberto':
            return { title: 'Aberto', color: statusColors['Aberto'] };
        case 'Aprovado':
            return { title: 'Aprovado', color: statusColors['Aprovado'] };
        case 'Rejeitado':
            return { title: 'Rejeitado', color: statusColors['Rejeitado'] };
        case 'Concluído':
            return { title: 'Concluído', color: statusColors['Concluído'] };
        case 'Em Revisão':
            return { title: 'Em Revisão', color: statusColors['Em Revisão'] };
        case 'Pendente':
            return { title: 'Pendente', color: statusColors['Pendente'] };
        case 'Justificativa Externa':
            return { title: 'Justificativa Externa', color: statusColors['Justificativa Externa'] };
        case 'Justificativa Interna':
            return { title: 'Justificativa Interna', color: statusColors['Justificativa Interna'] };
        default:
            return { title: status, color: statusColors['DEFAULT'] };
    }
};

