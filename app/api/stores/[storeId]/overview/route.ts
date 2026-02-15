import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getStoreClient } from "@/lib/store-client";

export async function GET(
  request: NextRequest,
  context: { params: { storeId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const client = await getStoreClient(context.params.storeId, session.user.id);

    const [ordersRes, productsRes, customersRes, salesRes] = await Promise.all([
      client.get("orders", {
        params: {
          per_page: 1
        }
      }),
      client.get("products", {
        params: {
          per_page: 1
        }
      }),
      client.get("customers", {
        params: {
          per_page: 1
        }
      }),
      client.get("reports/sales", {
        params: {
          period: "year"
        }
      })
    ]);

    const ordersCount = Number(ordersRes.headers["x-wc-total"] ?? 0);
    const productsCount = Number(productsRes.headers["x-wc-total"] ?? 0);
    const customersCount = Number(customersRes.headers["x-wc-total"] ?? 0);
    const totalRevenue =
      Number(
        (salesRes.data?.sales?.total_sales ??
          salesRes.data?.[0]?.total_sales ??
          0) as string
      ) || 0;

    return NextResponse.json({
      totalRevenue,
      ordersCount,
      productsCount,
      customersCount
    });
  } catch (error) {
    return new NextResponse("Failed to load overview", { status: 502 });
  }
}
