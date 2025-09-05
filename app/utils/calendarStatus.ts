export const statusColors: Record<string, string> = {
    'Pendente': 'bg-[#ffa44deb] border-[#FFA44D] text-white',
    'Concluído': 'bg-[#00a614cc] border-[#00A614] text-white',
    'Aberto': 'bg-[#2e97fcbd] border-[#2E97FC] text-white',
    'Aprovado': 'bg-[#00a614d9] border-[#00A614] text-white',
    'Reprovado': 'bg-[#ff0000bd] border-[#FF0000] text-white',
    'Justificativa Interna': 'bg-[#00708ecc] border-[#00708e] text-white',
    'Justificativa Externa': 'bg-[#008e78] border-[#008e78] text-white',
    'Em Revisão': 'bg-[#ffd507] border-[#ffd507] text-black',
    'DEFAULT': 'bg-gray-100 border-gray-300 text-gray-600'
};

export const filterStatusCalendarActivity = (status: string): { title: string; color: string } => {
    switch (status) {
        case 'Aberto':
            return { title: 'Aberto', color: statusColors['Aberto'] };
        case 'Aprovado':
            return { title: 'Aprovado', color: statusColors['Aprovado'] };
        case 'Reprovado':
            return { title: 'Reprovado', color: statusColors['Reprovado'] };
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

