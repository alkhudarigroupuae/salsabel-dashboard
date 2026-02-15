"use client";

import { ReactNode } from "react";
import { StoreContextProvider } from "@/stores/store-context";

export function StoreProvider(props: { children: ReactNode }) {
  return <StoreContextProvider>{props.children}</StoreContextProvider>;
}
