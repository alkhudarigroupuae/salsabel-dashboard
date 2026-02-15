import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

const storeBodySchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  consumerKey: z.string().min(1),
  consumerSecret: z.string().min(1)
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const stores = await prisma.store.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return NextResponse.json(
    stores.map((store) => ({
      id: store.id,
      name: store.name,
      url: store.url
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const json = await request.json();
  const parsed = storeBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }
  const body = parsed.data;
  const url = body.url.replace(/\/+$/, "");
  const created = await prisma.store.create({
    data: {
      name: body.name,
      url,
      consumerKeyEncrypted: encrypt(body.consumerKey),
      consumerSecretEncrypted: encrypt(body.consumerSecret),
      userId: session.user.id
    }
  });
  return NextResponse.json(
    {
      id: created.id,
      name: created.name,
      url: created.url
    },
    { status: 201 }
  );
}

