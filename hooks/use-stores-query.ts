"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { StoreSummary } from "@/stores/store-manager";

async function fetchStores() {
  const response = await apiClient.get<StoreSummary[]>("/stores");
  return response.data;
}

export function useStoresQuery() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
    staleTime: 60_000
  });
}
