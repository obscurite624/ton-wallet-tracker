// Fichero de store (session.store.js)
import { create } from 'zustand';

const useSessionStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  getUser: () => {
    return useSessionStore.getState().user;
  },
}));

export default useSessionStore;
