"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SectionStore {
    section: any;
    setSection: (section: any) => void;
}

export const useSectionStore = create<SectionStore>()(
    persist(
        (set) => ({
            section: 1,
            setSection: (section) => set({ section }),
        }),
        {
            name: "section-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);