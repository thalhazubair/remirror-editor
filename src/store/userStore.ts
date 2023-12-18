import { create } from 'zustand'; 
import { persist } from 'zustand/middleware';

interface timeState {
  token: any;
  setToken: (token: any) => void;

}

export const useStore = create<timeState>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token: any) => set({ token:token }),
    }),
    {
        name:'token'
    } // Add an empty options object
  ),
);

