"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoreContext } from "@/stores/store-context";

export function useRevenueAnalytics() {
  const { activeStoreId } = useStoreContext();
  return useQuery({
    queryKey: ["analytics", "revenue", activeStoreId],
    enabled: !!activeStoreId,
    queryFn: async () => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const response = await apiClient.get(
        `/stores/${activeStoreId}/analytics/revenue`
      );
      return response.data as { date: string; revenue: number }[];
    },
    staleTime: 60_000,
    retry: 2
  });
}

export function useOrdersAnalytics() {
  const { activeStoreId } = useStoreContext();
  return useQuery({
    queryKey: ["analytics", "orders", activeStoreId],
    enabled: !!activeStoreId,
    queryFn: async () => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const response = await apiClient.get(
        `/stores/${activeStoreId}/analytics/orders`
      );
      return response.data as { date: string; orders: number }[];
    },
    staleTime: 60_000,
    retry: 2
  });
}

