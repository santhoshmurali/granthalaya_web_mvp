"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import State from "@/components/State";
import { Shrine, mediaUrl, useApi } from "@/lib/api";

const CARD_STEP = 0.5;        // viewports of scroll between one card starting to rise and the next
const EXIT_STEP = 0.3;        // viewports between one card starting to leave and the next
const EXIT_LENGTH = 0.7;      // viewports a card takes to leave
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Total scroll length (in viewports) for `count` cards, excluding the pinned screen. */
export const cascadeLength = (count: number) =>
  (count - 1) * CARD_STEP + 1 + (count - 1) * EXIT_STEP + EXIT_LENGTH;

const STACK_PEEK_PX = 14;     // how far each folio underneath peeks out above the one on top
const STACK_PEEK_LEVELS = 3;  // folios that peek before the rest hide completely

const riseOf = (index: number, progress: number) => clamp(progress - index * CARD_STEP);

/** The top card leaves first, revealing the stack beneath it. */
const leaveOf = (index: number, count: number, progress: number) => {
  const exitStart = (count - 1) * CARD_STEP + 1 + (count - 1 - index) * EXIT_STEP;
  return clamp((progress - exitStart) / EXIT_LENGTH);
};

/** Card transform for scroll position `progress` (in viewports from section top). */
export function cardStyle(index: number, count: number, progress: number) {
  const rise = riseOf(index, progress);
  const leave = leaveOf(index, count, progress);
  let covered = 0;
  for (let later = index + 1; later < count; later++) {
    covered += riseOf(later, progress) * (1 - leaveOf(later, count, progress));
  }
  const depth = Math.min(covered, STACK_PEEK_LEVELS);
  const offset = (1 - rise) * 110 - leave * 120;
  return {
    transform: `translateY(calc(${offset}vh - ${depth * STACK_PEEK_PX}px)) scale(${1 - (1 - rise) * 0.04 - depth * 0.015})`,
    opacity: rise === 0 ? 0 : 1 - leave,
    visibility: rise === 0 || leave === 1 ? ("hidden" as const) : ("visible" as const),
    zIndex: index + 1,
  };
}

function ShrineCard({ shrine }: { shrine: Shrine }) {
  return (
    <article className="cascade-card">
      <img src={mediaUrl(shrine.images[0])} alt={shrine.title} loading="lazy" />
      <div className="cascade-card-text">
        <h3>{shrine.title}</h3>
        <p>{shrine.summary}</p>
        <Link className="text-link" href={`/about/shrines/#${shrine.slug}`}>
          Visit this shrine <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/** Cards rise from the bottom as the page scrolls, then leave upward one by one. */
export default function ShrineCascade() {
  const { data, error } = useApi<Shrine[]>("/shrines");
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      setProgress(-(sectionRef.current?.getBoundingClientRect().top ?? 0) / window.innerHeight);
    };
    const onScroll = () => { frame ||= requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, data]);

  const shrines = data?.filter((shrine) => shrine.images.length > 0) ?? [];
  if (!data || shrines.length === 0) return <section className="section"><State error={error} /></section>;

  if (reducedMotion) {
    return (
      <section className="section" aria-labelledby="shrines-heading">
        <h2 id="shrines-heading" className="section-title">The Shrines of Granthalaya</h2>
        <div className="cascade-static">{shrines.map((s) => <ShrineCard key={s.id} shrine={s} />)}</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="cascade" aria-labelledby="shrines-heading"
             style={{ height: `${(cascadeLength(shrines.length) + 1) * 100}vh` }}>
      <div className="cascade-pin">
        <h2 id="shrines-heading" className="section-title cascade-title">The Shrines of Granthalaya</h2>
        <div className="cascade-stage">
          {shrines.map((shrine, index) => (
            <div key={shrine.id} className="cascade-slot" style={cardStyle(index, shrines.length, progress)}>
              <ShrineCard shrine={shrine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
