"use client";
import { BellRing } from "lucide-react";
import { News, useApi } from "@/lib/api";

/** Banner listing the latest alerts above the header. */
export default function AlertBanner() {
  const { data } = useApi<News[]>("/news?kind=alert");
  const latest = data?.slice(0, 2) ?? [];
  if (latest.length === 0) return null;
  return (
    <div className="alert-banner" role="status" aria-label="Alerts">
      <BellRing size={18} aria-hidden />
      <span>{latest.map((alert) => alert.body ? `${alert.title}: ${alert.body}` : alert.title).join("  |  ")}</span>
    </div>
  );
}
