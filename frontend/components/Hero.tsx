"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import State from "@/components/State";
import { Page, mediaUrl, useApi } from "@/lib/api";

/** Landing highlight: headline, very short summary and link to About. */
export default function Hero() {
  const { data, error } = useApi<Page>("/pages/home");
  if (!data) return <section className="hero"><State error={error} /></section>;
  return (
    <section className="hero">
      {data.images[0] && <img className="hero-image" src={mediaUrl(data.images[0])} alt="" />}
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">Sri Raghavendra Granthalaya</p>
        <h1>{data.title}</h1>
        <p className="hero-summary">{data.summary}</p>
        <Link className="button" href="/about/">About Granthalaya <ArrowRight size={18} aria-hidden /></Link>
      </div>
    </section>
  );
}
