"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GetIDStore {
    id: string | number | null | any;
    id_service: string | number | null | any;
    setId: (id: number | string | null) => void;
    setIdService: (id: number | string | null) => void;
}

export const useGetIDStore = create<GetIDStore>()(
    persist(
        (set) => ({
            id: null,
            id_service: null,
            setId: (id) => set({ id }),
            setIdService: (id_service) => set({ id_service }),
        }),
        {
            name: "id-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
