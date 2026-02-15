import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getStoreClient } from "@/lib/store-client";

export async function GET(
  request: Request,
  context: { params: { storeId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const client = await getStoreClient(context.params.storeId, session.user.id);
    const response = await client.get("reports/sales", {
      params: {
        period: "month"
      }
    });
    const rows = response.data?.sales?.totals ?? response.data?.totals ?? {};
    const series = Object.keys(rows).map((dateKey) => ({
      date: dateKey,
      revenue: Number(rows[dateKey].total_sales ?? rows[dateKey].sales ?? 0)
    }));
    return NextResponse.json(series);
  } catch (error) {
    return new NextResponse("Failed to load revenue analytics", { status: 502 });
  }
}

