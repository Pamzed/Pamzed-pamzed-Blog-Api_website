import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isIconOnly: boolean;
  toggleIsIconOnly: () => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isIconOnly: false,
      toggleIsIconOnly: () =>
        set((state) => ({ isIconOnly: !state.isIconOnly })),
    }),
    {
      name: 'BLOG-UI',
    }
  )
);

export default useUIStore;
