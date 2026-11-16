"use client";
import { FormEvent, useState } from "react";
import ImageManager from "@/components/admin/ImageManager";
import { Shrine, api, useApi } from "@/lib/api";

type Draft = Omit<Shrine, "id" | "slug"> & { id?: number };
const EMPTY: Draft = { title: "", summary: "", body: "", images: [], sort_order: 100 };

/** List, add, edit (including images) and delete shrines. */
export default function ShrinesAdmin({ onError, onSaved }: { onError: (m: string) => void; onSaved: (m: string) => void }) {
  const { data, reload } = useApi<Shrine[]>("/shrines");
  const [draft, setDraft] = useState<Draft>();

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    const { id, ...payload } = draft;
    const request = id
      ? api(`/shrines/${id}`, { method: "PUT", body: JSON.stringify(payload) })
      : api("/shrines", { method: "POST", body: JSON.stringify(payload) });
    request.then(() => { setDraft(undefined); reload(); onSaved("Shrine saved"); }).catch((e: Error) => onError(e.message));
  };
  const remove = (shrine: Shrine) => {
    if (!window.confirm(`Delete "${shrine.title}"?`)) return;
    api(`/shrines/${shrine.id}`, { method: "DELETE" }).then(reload).catch((e: Error) => onError(e.message));
  };

  if (draft) {
    return (
      <form className="form" onSubmit={save} aria-label="Shrine form">
        <h2>{draft.id ? "Edit shrine" : "Add shrine"}</h2>
        <label>Title<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label>Short summary (shown on the landing card)
          <textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></label>
        <label>Full description (blank line between paragraphs)
          <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></label>
        <label>Display order
          <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label>
        <ImageManager images={draft.images} onChange={(images) => setDraft({ ...draft, images })} onError={onError} />
        <div className="row">
          <button className="button button-maroon" type="submit">Save shrine</button>
          <button type="button" className="button button-quiet" onClick={() => setDraft(undefined)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <button className="button button-maroon" onClick={() => setDraft(EMPTY)}>Add shrine</button>
      <div className="panel" style={{ marginTop: "1rem" }}>
        {data?.map((shrine) => (
          <div className="item-row" key={shrine.id}>
            <span className="item-title">{shrine.title}</span>
            <div className="row">
              <button className="button button-small button-quiet" aria-label={`Edit ${shrine.title}`}
                      onClick={() => setDraft(shrine)}>Edit</button>
              <button className="button button-small button-danger" aria-label={`Delete ${shrine.title}`}
                      onClick={() => remove(shrine)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
