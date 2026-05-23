import { create } from "zustand";
import type { LanguageCode } from "@/types/learning";

interface LanguageState {
  selectedCode: LanguageCode | null;
  setSelectedCode: (code: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedCode: null,
  setSelectedCode: (code) => set({ selectedCode: code }),
}));
