"use client";

import { useState } from "react";
import { z } from "zod";
import { useProducts, useUpdateProduct } from "@/hooks/use-products";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const productSchema = z.object({
  name: z.string().min(1),
  regular_price: z
    .string()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Number(value)),
      "Price must be a number"
    ),
  stock_quantity: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isInteger(Number(value)),
      "Stock must be an integer"
    )
});

type EditState = {
  open: boolean;
  product: any | null;
  name: string;
  regular_price: string;
  stock_quantity: string;
  error: string | null;
};

export function ProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editState, setEditState] = useState<EditState>({
    open: false,
    product: null,
    name: "",
    regular_price: "",
    stock_quantity: "",
    error: null
  });
  const { data, isLoading, isError, isFetching } = useProducts({
    page,
    search
  });
  const updateProduct = useUpdateProduct();

  const disabled = isLoading || isFetching;

  const items = data?.items ?? [];

  function openEdit(product: any) {
    setEditState({
      open: true,
      product,
      name: product.name ?? "",
      regular_price: product.regular_price ?? "",
      stock_quantity:
        typeof product.stock_quantity === "number"
          ? String(product.stock_quantity)
          : "",
      error: null
    });
  }

  function closeEdit() {
    setEditState((current) => ({
      ...current,
      open: false
    }));
  }

  function handleSubmit() {
    if (!editState.product) {
      return;
    }
    const parsed = productSchema.safeParse({
      name: editState.name,
      regular_price: editState.regular_price,
      stock_quantity: editState.stock_quantity
    });
    if (!parsed.success) {
      const firstError =
        parsed.error.errors[0]?.message ?? "Validation failed";
      setEditState((current) => ({
        ...current,
        error: firstError
      }));
      return;
    }
    const body: {
      name: string;
      regular_price?: string;
      stock_quantity?: number;
    } = {
      name: parsed.data.name
    };
    if (parsed.data.regular_price) {
      body.regular_price = parsed.data.regular_price;
    }
    if (parsed.data.stock_quantity) {
      body.stock_quantity = Number(parsed.data.stock_quantity);
    }
    updateProduct.mutate(
      {
        productId: editState.product.id,
        body
      },
      {
        onSuccess: () => {
          closeEdit();
        },
        onError: () => {
          setEditState((current) => ({
            ...current,
            error: "Failed to update product"
          }));
        }
      }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm font-semibold uppercase tracking-wide">
          Products
        </h1>
        <div className="flex flex-1 justify-end gap-2 text-xs">
          <div className="w-56">
            <Input
              placeholder="Search products"
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
          Failed to load products. Check your store connection and retry.
        </p>
      )}
      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-xs text-muted">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-xs text-muted">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>#{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.price ? `$${product.price}` : "$0"}
                  </TableCell>
                  <TableCell>
                    {typeof product.stock_quantity === "number"
                      ? product.stock_quantity
                      : "-"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {product.status}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px]"
                          onClick={() => openEdit(product)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      {editState.product && editState.product.id === product.id && (
                        <DialogContent>
                          <DialogTitle>Edit product</DialogTitle>
                          <DialogDescription className="text-xs">
                            Update basic details, price and stock.
                          </DialogDescription>
                          <div className="mt-4 space-y-3 text-xs">
                            <div className="space-y-1">
                              <label htmlFor="product-name">Name</label>
                              <Input
                                id="product-name"
                                value={editState.name}
                                onChange={(event) =>
                                  setEditState((current) => ({
                                    ...current,
                                    name: event.target.value
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="product-price">Price</label>
                              <Input
                                id="product-price"
                                value={editState.regular_price}
                                onChange={(event) =>
                                  setEditState((current) => ({
                                    ...current,
                                    regular_price: event.target.value
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="product-stock">Stock</label>
                              <Input
                                id="product-stock"
                                value={editState.stock_quantity}
                                onChange={(event) =>
                                  setEditState((current) => ({
                                    ...current,
                                    stock_quantity: event.target.value
                                  }))
                                }
                              />
                            </div>
                            {editState.error && (
                              <p className="text-xs text-red-400">
                                {editState.error}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex justify-end gap-2 text-xs">
                            <DialogClose asChild>
                              <Button type="button" size="sm" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              size="sm"
                              disabled={updateProduct.isPending}
                              onClick={handleSubmit}
                            >
                              Save
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
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
