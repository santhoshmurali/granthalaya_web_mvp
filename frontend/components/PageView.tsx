"use client";
import Markdown from "@/components/Markdown";
import State from "@/components/State";
import { Page, mediaUrl, useApi } from "@/lib/api";

/** A markdown content page (about, founder) with its reference images. */
export default function PageView({ slug }: { slug: string }) {
  const { data, error } = useApi<Page>(`/pages/${slug}`);
  if (!data) return <div className="page"><State error={error} /></div>;
  return (
    <div className="page">
      <h1>{data.title}</h1>
      {data.images.length > 0 && (
        <div className={`gallery gallery-${Math.min(data.images.length, 3)}`}>
          {data.images.map((file) => <img key={file} src={mediaUrl(file)} alt={data.title} />)}
        </div>
      )}
      <Markdown text={data.body} />
    </div>
  );
}
