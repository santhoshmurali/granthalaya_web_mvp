"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import State from "@/components/State";
import { Page, mediaUrl, useApi } from "@/lib/api";

/** Small founder section with portrait and link to the founder page. */
export default function FounderTeaser() {
  const { data, error } = useApi<Page>("/pages/founder");
  if (!data) return <section className="section"><State error={error} /></section>;
  return (
    <section className="section founder-teaser" aria-labelledby="founder-heading">
      {data.images[0] && <img src={mediaUrl(data.images[0])} alt={data.title} />}
      <div>
        <h2 id="founder-heading">{data.title}</h2>
        <p>{data.summary}</p>
        <Link className="text-link" href="/about/founder/">Read more about the founder <ArrowRight size={16} aria-hidden /></Link>
      </div>
    </section>
  );
}
