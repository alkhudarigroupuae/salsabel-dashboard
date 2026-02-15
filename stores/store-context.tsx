"use client";

import { createContext, ReactNode, useContext } from "react";
import type { StoreManagerState } from "./store-manager";
import { useStoreManager } from "./store-manager";

type StoreContextValue = StoreManagerState | null;

const StoreContext = createContext<StoreContextValue>(null);

export function StoreContextProvider(props: { children: ReactNode }) {
  const value = useStoreManager();
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("StoreContext is not available");
  }
  return value;
}
