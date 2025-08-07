"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GetIDStore {
    id: string | number | null | any;
    id_ambiente: string | number | null | any;
    setId: (id: number | string) => void;
    setIdAmbiente: (id: number | string) => void;
}

export const useGetIDStore = create<GetIDStore>()(
    persist(
        (set) => ({
            id: null,
            id_ambiente: null,
            setId: (id) => set({ id }),
            setIdAmbiente: (id_ambiente) => set({ id_ambiente }),
        }),
        {
            name: "id-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
