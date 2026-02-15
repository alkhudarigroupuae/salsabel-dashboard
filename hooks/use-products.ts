"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoreContext } from "@/stores/store-context";

export type ProductsQueryParams = {
  page: number;
  search?: string;
};

export function useProducts(params: ProductsQueryParams) {
  const { activeStoreId } = useStoreContext();
  return useQuery({
    queryKey: ["products", activeStoreId, params],
    enabled: !!activeStoreId,
    queryFn: async () => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      if (params.search) {
        search.set("search", params.search);
      }
      const response = await apiClient.get(
        `/stores/${activeStoreId}/products?${search.toString()}`
      );
      return response.data as {
        items: any[];
        page: number;
        total: number;
        totalPages: number;
      };
    },
    retry: 2
  });
}

export function useUpdateProduct() {
  const client = useQueryClient();
  const { activeStoreId } = useStoreContext();
  return useMutation({
    mutationFn: async (payload: {
      productId: number;
      body: { name: string; regular_price?: string; stock_quantity?: number };
    }) => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const response = await apiClient.patch(
        `/stores/${activeStoreId}/products/${payload.productId}`,
        payload.body
      );
      return response.data;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["products", activeStoreId]
      });
    }
  });
}

