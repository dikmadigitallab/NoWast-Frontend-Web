type SetorEmpresarial = {
    id: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type SetorEmpresarialResponse = {
    data: {
        items: SetorEmpresarial[];
        totalCount: number;
        pageSize: number;
        pageNumber: number;
        count: number;
        totalPages: number;
        isFirstPage: boolean;
        isLastPage: boolean;
    }
};