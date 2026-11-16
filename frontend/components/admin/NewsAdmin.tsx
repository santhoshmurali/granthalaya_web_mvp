"use client";
import { FormEvent, useState } from "react";
import { News, api, formatDate, useApi } from "@/lib/api";

const EMPTY = { kind: "news", title: "", body: "" };

/** Post, edit and delete news items and alerts. */
export default function NewsAdmin({ onError }: { onError: (message: string) => void }) {
  const { data, reload } = useApi<News[]>("/news");
  const [form, setForm] = useState<{ kind: string; title: string; body: string }>(EMPTY);
  const [editingId, setEditingId] = useState<number>();

  const save = (event: FormEvent) => {
    event.preventDefault();
    const request = editingId
      ? api(`/news/${editingId}`, { method: "PUT", body: JSON.stringify(form) })
      : api("/news", { method: "POST", body: JSON.stringify(form) });
    request.then(() => { setForm(EMPTY); setEditingId(undefined); reload(); }).catch((e: Error) => onError(e.message));
  };
  const remove = (id: number) => api(`/news/${id}`, { method: "DELETE" }).then(reload).catch((e: Error) => onError(e.message));

  return (
    <>
      <form className="panel form" onSubmit={save} aria-label="News form">
        <h2>{editingId ? "Edit item" : "Post news or alert"}</h2>
        <label>Type
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="news">News</option>
            <option value="alert">Alert</option>
          </select>
        </label>
        <label>Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>Details
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </label>
        <div className="row">
          <button className="button button-maroon" type="submit">{editingId ? "Save changes" : "Publish"}</button>
          {editingId && <button type="button" className="button button-quiet" onClick={() => { setEditingId(undefined); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>
      <div className="panel">
        {data?.map((item) => (
          <div className="item-row" key={item.id}>
            <div className="item-title">
              <span className={item.kind === "alert" ? "badge badge-alert" : "badge"}>{item.kind}</span>
              {item.title} <small>({formatDate(item.created_at)})</small>
            </div>
            <div className="row">
              <button className="button button-small button-quiet" aria-label={`Edit ${item.title}`}
                      onClick={() => { setEditingId(item.id); setForm({ kind: item.kind, title: item.title, body: item.body }); }}>Edit</button>
              <button className="button button-small button-danger" aria-label={`Delete ${item.title}`}
                      onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
