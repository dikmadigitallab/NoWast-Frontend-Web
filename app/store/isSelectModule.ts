"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface isSelectModule {
    isSelectModule: boolean;
    SetisSelectModule: (isSelectModule: boolean) => void;
}

export const useSelectModule = create<isSelectModule>()(
    persist(
        (set) => ({
            isSelectModule: false,
            SetisSelectModule: (isSelectModule) => set({ isSelectModule }),
        }),
        {
            name: "is-module-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

