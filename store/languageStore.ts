import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LanguageCode } from "@/types/learning";

interface LanguageState {
  selectedCode: LanguageCode | null;
  hasHydrated: boolean;
  setSelectedCode: (code: LanguageCode) => void;
  clearLanguage: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedCode: null,
      hasHydrated: false,
      setSelectedCode: (code) => set({ selectedCode: code }),
      clearLanguage: () => set({ selectedCode: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, _error) => {
        const target = state ?? useLanguageStore.getState();
        target.setHasHydrated(true);
      },
    },
  ),
);
