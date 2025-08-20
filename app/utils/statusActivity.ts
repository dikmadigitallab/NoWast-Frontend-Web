export const filterStatusActivity = (status: string): string => {
    switch (status) {
        case 'OPEN':
            return 'Aberto';
        case 'APPROVED':
            return 'Aprovado';
        case 'REJECTED':
            return 'Rejeitado';
        case 'COMPLETED':
            return 'Concluído';
        case 'UNDER_REVIEW':
            return 'Em revisão';
        case 'PENDING':
            return 'Pendente';
        case 'JUSTIFIED':
            return 'Justificado';
        case 'INTERNAL_JUSTIFICATION':
            return 'Justificação interna';
        default:
            return status;
    }
};
