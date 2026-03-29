import { create } from "zustand";

type AppState = {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  isUnlocked: false,
  unlock: () => set({ isUnlocked: true }),
  lock: () => set({ isUnlocked: false })
}));
