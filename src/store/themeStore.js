import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  dark: false,
  setDark: (dark) => {
    set({ dark });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark);
    }
  },
  toggle: () => set((state) => {
    const next = !state.dark;
    if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', next);
    return { dark: next };
  })
}));
