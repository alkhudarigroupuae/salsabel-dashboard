import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function ProtectedLayout(props: { children: ReactNode }) {
  return <AppShell>{props.children}</AppShell>;
}
