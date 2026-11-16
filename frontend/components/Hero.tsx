"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import State from "@/components/State";
import { Page, mediaUrl, useApi } from "@/lib/api";

/** Landing highlight: headline, very short summary, link to About, portrait in a temple-niche frame. */
export default function Hero() {
  const { data, error } = useApi<Page>("/pages/home");
  if (!data) return <section className="hero"><State error={error} /></section>;
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <h1>{data.title}</h1>
          <p className="hero-summary">{data.summary}</p>
          <Link className="button button-maroon" href="/about/">About Granthalaya <ArrowRight size={18} aria-hidden /></Link>
        </div>
        {data.images[0] && (
          <figure className="hero-niche">
            <img src={mediaUrl(data.images[0])} alt="The Brindavana of Sri Raghavendra at Granthalaya" fetchPriority="high" />
          </figure>
        )}
      </div>
    </section>
  );
}
