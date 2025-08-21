export const filterStatusActivity = (status: string): { title: string; color: string } => {
    switch (status) {
        case 'OPEN':
            return { title: 'Aberto', color: 'blue' };
        case 'APPROVED':
            return { title: 'Aprovado', color: 'green' };
        case 'REJECTED':
            return { title: 'Reprovado', color: 'red' };
        case 'COMPLETED':
            return { title: 'Concluído', color: 'gray' };
        case 'UNDER_REVIEW':
            return { title: 'Em revisão', color: 'yellow' };
        case 'PENDING':
            return { title: 'Pendente', color: 'orange' };
        case 'JUSTIFIED':
            return { title: 'Justificado', color: 'purple' };
        case 'INTERNAL_JUSTIFICATION':
            return { title: 'Justificação interna', color: 'pink' };
        default:
            return { title: status, color: 'black' };
    }
};

