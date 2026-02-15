import { create } from "zustand";

export type StoreSummary = {
  id: string;
  name: string;
  url: string;
};

export type StoreManagerState = {
  stores: StoreSummary[];
  activeStoreId: string | null;
  setStores: (stores: StoreSummary[]) => void;
  setActiveStoreId: (id: string) => void;
};

export const useStoreManager = create<StoreManagerState>((set) => ({
  stores: [],
  activeStoreId: null,
  setStores: (stores) =>
    set({
      stores
    }),
  setActiveStoreId: (id) =>
    set({
      activeStoreId: id
    })
}));
