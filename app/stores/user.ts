import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  email: string;
  full_name: string;
  last_login: string;
  role: string;
};

interface UserState {
  adminId: string;
  user: User | null;
  setAdminId: (id: string) => void;
  setUser: (user: User) => void;
  removeUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      adminId: '',
      user: null,
      setUser: (newUser: any) => set({ user: newUser }),
      removeUser: () => set({ user: null }),
      setAdminId: (id: string) => set({ adminId: id }),
    }),
    {
      name: 'BLOG-USER',
    }
  )
);

export default useUserStore;
