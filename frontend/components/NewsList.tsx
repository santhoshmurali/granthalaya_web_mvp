"use client";
import { AlertTriangle, Newspaper } from "lucide-react";
import State from "@/components/State";
import { News, formatDate, useApi } from "@/lib/api";

/** News and alerts as cards; `limit` trims the list for the landing page. */
export default function NewsList({ limit }: { limit?: number }) {
  const { data, error } = useApi<News[]>("/news");
  if (!data) return <State error={error} />;
  const items = data.slice(0, limit);
  if (items.length === 0) return <p className="state">No news yet.</p>;
  return (
    <ul className="news-list">
      {items.map((item) => (
        <li key={item.id} className={`news-item news-${item.kind}`}>
          <div className="news-kind">
            {item.kind === "alert" ? <AlertTriangle size={16} aria-hidden /> : <Newspaper size={16} aria-hidden />}
            {item.kind === "alert" ? "Alert" : "News"} &middot; {formatDate(item.created_at)}
          </div>
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
        </li>
      ))}
    </ul>
  );
}
