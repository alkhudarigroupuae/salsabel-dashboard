import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getStoreClient } from "@/lib/store-client";

const bodySchema = z.object({
  name: z.string().min(1),
  regular_price: z.string().optional(),
  stock_quantity: z.number().int().optional()
});

export async function PATCH(
  request: NextRequest,
  context: { params: { storeId: string; productId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }
  try {
    const client = await getStoreClient(context.params.storeId, session.user.id);
    const response = await client.put(`products/${context.params.productId}`, parsed.data);
    return NextResponse.json(response.data);
  } catch (error) {
    return new NextResponse("Failed to update product", { status: 502 });
  }
}

