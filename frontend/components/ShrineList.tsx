"use client";
import { useEffect } from "react";
import State from "@/components/State";
import { Shrine, mediaUrl, useApi } from "@/lib/api";

/** Every shrine with its images and story; each has an anchor id (its slug). */
export default function ShrineList() {
  const { data, error } = useApi<Shrine[]>("/shrines");

  useEffect(() => {
    if (data && window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    }
  }, [data]);

  if (!data) return <State error={error} />;
  return (
    <div className="shrine-list">
      {data.map((shrine) => (
        <article key={shrine.id} id={shrine.slug} className="shrine">
          <h2>{shrine.title}</h2>
          {shrine.images.length > 0 && (
            <div className={`gallery gallery-${Math.min(shrine.images.length, 3)}`}>
              {shrine.images.map((file) => <img key={file} src={mediaUrl(file)} alt={shrine.title} loading="lazy" />)}
            </div>
          )}
          {shrine.body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </article>
      ))}
    </div>
  );
}
