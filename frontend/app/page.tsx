import Link from "next/link";
import FounderTeaser from "@/components/FounderTeaser";
import Hero from "@/components/Hero";
import NewsList from "@/components/NewsList";
import ShrineCascade from "@/components/ShrineCascade";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShrineCascade />
      <FounderTeaser />
      <section className="section" aria-labelledby="news-heading">
        <h2 id="news-heading" className="section-title">News and Alerts</h2>
        <NewsList limit={3} />
        <p><Link className="text-link" href="/news/">All news and alerts</Link></p>
      </section>
    </>
  );
}
