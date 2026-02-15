"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateOrderStatus } from "@/hooks/use-orders";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "on-hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" }
];

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, isFetching } = useOrders({
    page,
    status,
    search
  });
  const updateStatus = useUpdateOrderStatus();

  const disabled = isLoading || isFetching;

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm font-semibold uppercase tracking-wide">
          Orders
        </h1>
        <div className="flex flex-1 justify-end gap-2 text-xs">
          <div className="w-40">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-56">
            <Input
              placeholder="Search orders"
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
          Failed to load orders. Check your store connection and retry.
        </p>
      )}
      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-xs text-muted">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-xs text-muted">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {order.date_created
                      ? new Date(order.date_created).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.status}
                  </TableCell>
                  <TableCell>
                    {order.total ? `$${order.total}` : "$0"}
                  </TableCell>
                  <TableCell>
                    {order.billing?.first_name || order.billing?.last_name
                      ? `${order.billing.first_name} ${order.billing.last_name}`
                      : order.billing?.email || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {["pending", "processing", "on-hold"].map((target) => (
                        <Button
                          key={target}
                          size="sm"
                          variant={order.status === target ? "default" : "outline"}
                          disabled={disabled || updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: target
                            })
                          }
                          className="text-[11px]"
                        >
                          {target}
                        </Button>
                      ))}
                      {["completed", "cancelled"].map((target) => (
                        <Button
                          key={target}
                          size="sm"
                          variant={order.status === target ? "default" : "outline"}
                          disabled={disabled || updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: target
                            })
                          }
                          className="text-[11px]"
                        >
                          {target}
                        </Button>
                      ))}
                    </div>
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
