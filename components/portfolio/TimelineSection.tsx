"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { TimelineEntry } from "@/lib/portfolio-data";

interface Props {
  data: TimelineEntry[];
}

const TYPE_CONFIG = {
  work: { label: "Milestone", color: "var(--malt)", bg: "rgba(200,169,126,0.1)" },
  education: { label: "Learning", color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.06)" },
  project: { label: "Series", color: "var(--signal)", bg: "rgba(198,0,109,0.1)" },
};

function TimelineItem({ entry, index, total }: { entry: TimelineEntry; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const config = TYPE_CONFIG[entry.type];
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 lg:gap-10"
    >
      {/* Left: Year column */}
      <div className="flex-shrink-0 w-16 lg:w-24 text-right pt-1">
        <span
          className="font-mono-folio text-[0.75rem] font-medium tracking-[0.06em]"
          style={{ color: "var(--malt)" }}
        >
          {entry.year}
        </span>
      </div>

      {/* Center: Timeline line + dot */}
      <div className="flex-shrink-0 flex flex-col items-center">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10 w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1"
          style={{
            borderColor: config.color,
            background: isInView ? config.color : "transparent",
            boxShadow: isInView ? `0 0 12px ${config.color}60` : "none",
          }}
        />

        {/* Line segment */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.08 + 0.3, ease: "easeOut" }}
            className="flex-1 w-px mt-2"
            style={{ background: "linear-gradient(to bottom, rgba(200,169,126,0.3), rgba(200,169,126,0.05))", minHeight: "60px" }}
          />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 pb-12">
        {/* Type badge */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 font-mono-folio text-[9px] tracking-[0.1em] uppercase border"
            style={{
              color: config.color,
              borderColor: config.color + "40",
              background: config.bg,
            }}
          >
            {config.label}
          </span>
        </div>

        <h3 className="text-[1rem] font-semibold leading-[1.3] tracking-[-0.01em] text-white mb-1">
          {entry.title}
        </h3>
        <p
          className="font-mono-folio text-[0.75rem] tracking-[0.04em] mb-3"
          style={{ color: "var(--malt)", opacity: 0.8 }}
        >
          {entry.company}
        </p>
        <p className="text-[0.8125rem] leading-[1.65] text-white/50">
          {entry.description}
        </p>
      </div>
    </motion.div>
  );
}

export function TimelineSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="timeline"
      className="portfolio-section relative bg-[#111111] py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-index" style={{ color: "var(--malt)" }}>
            04 — Journey
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14"
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            The vlogging{" "}
            <span style={{ color: "var(--malt)" }}>journey</span>{" "}
            so far
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {data.map((entry, i) => (
            <TimelineItem key={entry.id} entry={entry} index={i} total={data.length} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}
