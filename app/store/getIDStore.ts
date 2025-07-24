"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GetIDStore {
    id: string | number | null | any;
    setId: (id: number | string) => void;
}

export const useGetIDStore = create<GetIDStore>()(
    persist(
        (set) => ({
            id: null,
            setId: (id) => set({ id }),
        }),
        {
            name: "id-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);