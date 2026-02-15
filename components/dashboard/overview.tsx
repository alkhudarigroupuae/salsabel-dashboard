"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoreContext } from "@/stores/store-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OverviewResponse = {
  totalRevenue: number;
  ordersCount: number;
  productsCount: number;
  customersCount: number;
};

export function DashboardOverview() {
  const { activeStoreId } = useStoreContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["overview", activeStoreId],
    queryFn: async () => {
      if (!activeStoreId) {
        throw new Error("No active store");
      }
      const response = await apiClient.get<OverviewResponse>(
        `/stores/${activeStoreId}/overview`
      );
      return response.data;
    },
    enabled: !!activeStoreId,
    retry: 2
  });

  useEffect(() => {
    if (activeStoreId) {
      refetch();
    }
  }, [activeStoreId, refetch]);

  const loading = isLoading || !activeStoreId;

  return (
    <div className="space-y-4">
      <h1 className="text-sm font-semibold uppercase tracking-wide">
        Overview
      </h1>
      {!activeStoreId && (
        <p className="text-xs text-muted">
          Select or configure a store in Settings to see data.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <MetricCard
          label="Total revenue"
          value={data?.totalRevenue ?? 0}
          prefix="$"
          loading={loading}
        />
        <MetricCard
          label="Orders"
          value={data?.ordersCount ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Products"
          value={data?.productsCount ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Customers"
          value={data?.customersCount ?? 0}
          loading={loading}
        />
      </div>
      {isError && activeStoreId && (
        <p className="text-xs text-red-400">
          Failed to load overview. Check your store credentials and try again.
        </p>
      )}
    </div>
  );
}

function MetricCard(props: {
  label: string;
  value: number;
  prefix?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.label}</CardTitle>
      </CardHeader>
      <CardContent>
        {props.loading ? (
          <div className="h-4 w-16 animate-pulse bg-muted" />
        ) : (
          <div className="text-lg font-semibold">
            {props.prefix}
            {Intl.NumberFormat().format(props.value)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

