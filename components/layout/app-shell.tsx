"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useStoreContext } from "@/stores/store-context";
import { useStoresQuery } from "@/hooks/use-stores-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/products", label: "Products" },
  { href: "/customers", label: "Customers" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

export function AppShell(props: { children: ReactNode }) {
  const pathname = usePathname();
  const { stores, activeStoreId, setActiveStoreId, setStores } = useStoreContext();
  const { data, isLoading } = useStoresQuery();

  useEffect(() => {
    if (data) {
      setStores(data);
      if (!activeStoreId && data.length > 0) {
        setActiveStoreId(data[0].id);
      }
    }
  }, [data, activeStoreId, setActiveStoreId, setStores]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-60 flex-col border-r border-border bg-black/60">
        <div className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
          Salsabel
        </div>
        <nav className="flex-1 px-2 py-3 text-xs">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "flex items-center justify-between border px-3 py-2 " +
                      (active
                        ? "border-primary bg-primary text-black"
                        : "border-transparent bg-transparent text-foreground hover:border-border hover:bg-accent")
                    }
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-[11px]"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-muted">Active store</span>
            <div className="w-56">
              <Select
                value={activeStoreId ?? ""}
                onValueChange={(value) => setActiveStoreId(value)}
                disabled={isLoading || stores.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading stores..." : "Select store"} />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto px-4 py-4">
          {props.children}
        </div>
      </main>
    </div>
  );
}

