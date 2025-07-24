"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface isSelectModule {
    isSelectModule: boolean;
    isSelectLoading: boolean;
    setIsSelectLoading: (isSelectLoading: boolean) => void;
    SetisSelectModule: (isSelectModule: boolean) => void;
}

export const useSelectModule = create<isSelectModule>()(
    persist(
        (set) => ({
            isSelectModule: false,
            isSelectLoading: false,
            setIsSelectLoading: (isSelectLoading) => set({ isSelectLoading }),
            SetisSelectModule: (isSelectModule) => set({ isSelectModule }),
        }),
        {
            name: "is-module-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

