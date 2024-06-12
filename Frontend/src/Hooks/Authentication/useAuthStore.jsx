import {create} from 'zustand';

const useAuthStore = create((set) => ({
    token: null,
    user: null,
    setToken: (newToken) => set({ token: newToken }),
    setUser: (newUser) => set({ user: newUser }),
}));

export default useAuthStore;