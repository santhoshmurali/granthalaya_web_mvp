"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type News = { id: number; kind: "news" | "alert"; title: string; body: string; created_at: string };
export type Shrine = { id: number; slug: string; title: string; summary: string; body: string; images: string[]; sort_order: number };
export type Page = { slug: string; title: string; summary: string; body: string; images: string[] };

export const mediaUrl = (file: string) => `/media/${file}`;

/** Call the JSON API; throws an Error carrying the server's `detail` message. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: init?.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : undefined,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === "string" ? body.detail : `Request failed (${response.status})`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

/** Fetch a public endpoint on mount; `reload` refetches. */
export function useApi<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const latestPath = useRef(path);
  latestPath.current = path;
  const reload = useCallback(() => {
    api<T>(path)
      .then((result) => { if (latestPath.current === path) { setData(result); setError(undefined); } })
      .catch((e: Error) => { if (latestPath.current === path) setError(e.message); });
  }, [path]);
  useEffect(reload, [reload]);
  return { data, error, reload };
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
