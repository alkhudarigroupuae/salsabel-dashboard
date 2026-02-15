import axios from "axios";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

export async function getStoreClient(storeId: string, userId: string) {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId
    }
  });
  if (!store) {
    throw new Error("Store not found");
  }
  const baseURL = store.url.replace(/\/+$/, "") + "/wp-json/wc/v3/";
  const auth = {
    username: decrypt(store.consumerKeyEncrypted),
    password: decrypt(store.consumerSecretEncrypted)
  };
  return axios.create({
    baseURL,
    auth,
    timeout: 15000
  });
}

