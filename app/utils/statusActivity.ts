export const statusColors: Record<string, string> = {
    'Grave': '#DE494C',
    'Pendente': '#FFA44D',
    'Concluído': '#00A614',
    'Aberto': '#2E97FC',
    'Leve': '#FFD400',
    'Aprovado': '#00A614',
    'Reprovado': '#FF0000',
    'Justificativa Interna': '#00708e',
    'Justificativa Externa': '#008e78',
    'DEFAULT': 'bg-gray-100'
};

export const filterStatusActivity = (status: string) => {
    switch (status) {
        case 'OPEN':
            return { title: 'Aberto', color: statusColors['Aberto'] };
        case 'APPROVED':
            return { title: 'Aprovado', color: statusColors['Aprovado'] };
        case 'REJECTED':
            return { title: 'Reprovado', color: statusColors['Reprovado'] };
        case 'COMPLETED':
            return { title: 'Concluído', color: statusColors['Concluído'] };
        case 'UNDER_REVIEW':
            return { title: 'Grave', color: statusColors['Grave'] };
        case 'PENDING':
            return { title: 'Pendente', color: statusColors['Pendente'] };
        case 'JUSTIFIED':
            return { title: 'Justificativa Externa', color: statusColors['Justificativa Externa'] };
        case 'INTERNAL_JUSTIFICATION':
            return { title: 'Justificativa Interna', color: statusColors['Justificativa Interna'] };
        default:
            return { title: status, color: statusColors['DEFAULT'] };
    }
};

