import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { siteSettings } from '../siteSettings';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [], // [{email, password, name}]
      currentUser: null, // {email, name, isAdmin}
      register: (email, password, name) => {
        const state = get();
        if (state.users.find(u => u.email === email)) {
          throw new Error('User already exists');
        }
        const newUsers = [...state.users, { email, password, name }];
        set({ users: newUsers });
      },
      login: (email, password) => {
        const state = get();
        const user = state.users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const isAdmin = email === siteSettings.adminEmail;
        set({ currentUser: { email: user.email, name: user.name, isAdmin } });
      },
      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'premium-store-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users, currentUser: state.currentUser }),
    }
  )
);