"use client";

import { create } from "zustand";

interface GetIDStore {
    id: number | string | null;
    setId: (id: number | string) => void;
}

export const useGetIDStore = create<GetIDStore>((set) => {
    let storedId: string | number | null = null;

    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("id");
        if (stored) {
            storedId = stored;
        }
    }

    return {
        id: storedId,
        setId: (id: number | string) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("id", String(id));
            }
            set({ id });
        },
    };
});
