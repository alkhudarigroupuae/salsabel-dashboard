"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoreContext } from "@/stores/store-context";

export type CustomersQueryParams = {
  page: number;
  search?: string;
};

export function useCustomers(params: CustomersQueryParams) {
  const { activeStoreId } = useStoreContext();
  return useQuery({
    queryKey: ["customers", activeStoreId, params],
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
        `/stores/${activeStoreId}/customers?${search.toString()}`
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

