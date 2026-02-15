"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoreContext } from "@/stores/store-context";

export type OrdersQueryParams = {
  page: number;
  status?: string;
  search?: string;
};

export function useOrders(params: OrdersQueryParams) {
  const { activeStoreId } = useStoreContext();
  return useQuery({
    queryKey: ["orders", activeStoreId, params],
    enabled: !!activeStoreId,
    queryFn: async () => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      if (params.status && params.status !== "all") {
        search.set("status", params.status);
      }
      if (params.search) {
        search.set("search", params.search);
      }
      const response = await apiClient.get(
        `/stores/${activeStoreId}/orders?${search.toString()}`
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

export function useUpdateOrderStatus() {
  const client = useQueryClient();
  const { activeStoreId } = useStoreContext();
  return useMutation({
    mutationFn: async (payload: { orderId: number; status: string }) => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const response = await apiClient.patch(
        `/stores/${activeStoreId}/orders/${payload.orderId}`,
        {
          status: payload.status
        }
      );
      return response.data;
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["orders", activeStoreId]
      });
    }
  });
}

