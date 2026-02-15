import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getStoreClient } from "@/lib/store-client";

const bodySchema = z.object({
  status: z.string().min(1)
});

export async function PATCH(
  request: NextRequest,
  context: { params: { storeId: string; orderId: string } }
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
    const response = await client.put(`orders/${context.params.orderId}`, {
      status: parsed.data.status
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return new NextResponse("Failed to update order", { status: 502 });
  }
}

