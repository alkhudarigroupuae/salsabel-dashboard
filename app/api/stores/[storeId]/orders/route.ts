import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getStoreClient } from "@/lib/store-client";

const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.string().optional(),
  search: z.string().optional()
});

export async function GET(
  request: NextRequest,
  context: { params: { storeId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const parsed = listSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }
  const { page, status, search } = parsed.data;
  try {
    const client = await getStoreClient(context.params.storeId, session.user.id);
    const response = await client.get("orders", {
      params: {
        per_page: 20,
        page,
        status: status && status !== "all" ? status : undefined,
        search: search || undefined
      }
    });
    const total = Number(response.headers["x-wc-total"] ?? 0);
    const totalPages = Number(response.headers["x-wc-totalpages"] ?? 0);
    return NextResponse.json({
      items: response.data,
      page,
      total,
      totalPages
    });
  } catch (error) {
    return new NextResponse("Failed to load orders", { status: 502 });
  }
}

