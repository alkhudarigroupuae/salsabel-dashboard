"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useStoresQuery } from "@/hooks/use-stores-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const storeSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  consumerKey: z.string().min(1),
  consumerSecret: z.string().min(1)
});

export default function SettingsPage() {
  const { data: stores, isLoading } = useStoresQuery();
  const client = useQueryClient();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const parsed = storeSchema.safeParse({
      name,
      url,
      consumerKey,
      consumerSecret
    });
    if (!parsed.success) {
      const firstError =
        parsed.error.errors[0]?.message ?? "Validation failed";
      setError(firstError);
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/stores", parsed.data);
      await client.invalidateQueries({
        queryKey: ["stores"]
      });
      setName("");
      setUrl("");
      setConsumerKey("");
      setConsumerSecret("");
    } catch (err) {
      setError("Failed to save store. Verify URL and credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-semibold uppercase tracking-wide">
        Settings
      </h1>
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide">
          Connected stores
        </h2>
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-xs text-muted">
                    Loading stores...
                  </TableCell>
                </TableRow>
              ) : !stores || stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-xs text-muted">
                    No stores configured yet.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="text-xs">{store.name}</TableCell>
                    <TableCell className="text-xs">{store.url}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide">
          Add store connection
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3 text-xs md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="store-name">Name</label>
            <Input
              id="store-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <label htmlFor="store-url">Store URL</label>
            <Input
              id="store-url"
              placeholder="https://yourstore.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="consumer-key">Consumer key</label>
            <Input
              id="consumer-key"
              value={consumerKey}
              onChange={(event) => setConsumerKey(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="consumer-secret">Consumer secret</label>
            <Input
              id="consumer-secret"
              type="password"
              value={consumerSecret}
              onChange={(event) => setConsumerSecret(event.target.value)}
            />
          </div>
          {error && (
            <div className="col-span-full text-xs text-red-400">
              {error}
            </div>
          )}
          <div className="col-span-full flex justify-end">
            <Button
              type="submit"
              disabled={
                submitting ||
                !name ||
                !url ||
                !consumerKey ||
                !consumerSecret
              }
            >
              {submitting ? "Saving..." : "Save store"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

