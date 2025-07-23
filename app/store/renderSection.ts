"use client";

import { create } from "zustand";

interface SectionStore {
    section: any;
    setSection: (section: any) => void;
}

export const useSectionStore = create<SectionStore>()(
    (set) => ({
        section: 1,
        setSection: (section) => set({ section }),
    }),
);