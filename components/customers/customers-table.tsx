"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export function CustomersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, isFetching } = useCustomers({
    page,
    search
  });

  const disabled = isLoading || isFetching;

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm font-semibold uppercase tracking-wide">
          Customers
        </h1>
        <div className="flex flex-1 justify-end gap-2 text-xs">
          <div className="w-56">
            <Input
              placeholder="Search customers"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
      {isError && (
        <p className="text-xs text-red-400">
          Failed to load customers. Check your store connection and retry.
        </p>
      )}
      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total orders</TableHead>
              <TableHead>Total spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-xs text-muted">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-xs text-muted">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>#{customer.id}</TableCell>
                  <TableCell>
                    {customer.first_name || customer.last_name
                      ? `${customer.first_name} ${customer.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell>
                    {typeof customer.orders_count === "number"
                      ? customer.orders_count
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {typeof customer.total_spent === "string"
                      ? `$${customer.total_spent}`
                      : "$0"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span>
          Page {data?.page ?? 1} of {data?.totalPages ?? 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={disabled || (data?.page ?? 1) <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={
              disabled ||
              !data ||
              data.page >= data.totalPages ||
              data.totalPages === 0
            }
            onClick={() =>
              setPage((current) =>
                data ? Math.min(data.totalPages, current + 1) : current + 1
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

