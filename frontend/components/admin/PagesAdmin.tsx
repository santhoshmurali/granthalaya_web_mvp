"use client";
import { FormEvent, useEffect, useState } from "react";
import ImageManager from "@/components/admin/ImageManager";
import { Page, api, useApi } from "@/lib/api";

const PAGES = [
  { slug: "home", label: "Landing highlight" },
  { slug: "about", label: "About Granthalaya" },
  { slug: "founder", label: "About Founder" },
];

/** Edit the text and images of the home highlight, About and Founder pages. */
export default function PagesAdmin({ onError, onSaved }: { onError: (m: string) => void; onSaved: (m: string) => void }) {
  const [slug, setSlug] = useState("home");
  const { data } = useApi<Page>(`/pages/${slug}`);
  const [draft, setDraft] = useState<Page>();
  useEffect(() => setDraft(data?.slug === slug ? data : undefined), [data, slug]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    const { slug: _slug, ...payload } = draft;
    api(`/pages/${slug}`, { method: "PUT", body: JSON.stringify(payload) })
      .then(() => onSaved("Page saved")).catch((e: Error) => onError(e.message));
  };

  return (
    <div>
      <label className="form">Page
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {PAGES.map((page) => <option key={page.slug} value={page.slug}>{page.label}</option>)}
        </select>
      </label>
      {draft && (
        <form className="form" onSubmit={save} aria-label="Page form" style={{ marginTop: "1rem" }}>
          <label>Title<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label>Short summary (landing page text)
            <textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></label>
          <label>Content (markdown)
            <textarea style={{ minHeight: "16rem" }} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></label>
          <ImageManager images={draft.images} onChange={(images) => setDraft({ ...draft, images })} onError={onError} />
          <div><button className="button button-maroon" type="submit">Save page</button></div>
        </form>
      )}
    </div>
  );
}
