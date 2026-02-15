import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { StoreProvider } from "@/components/providers/store-provider";

export const metadata: Metadata = {
  title: "Salsabel Dashboard",
  description: "Headless WooCommerce admin dashboard"
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <StoreProvider>{props.children}</StoreProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
