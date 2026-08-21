"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/portfolio-data";

interface Props {
  data: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  // Food/travel vibe warm dark gradients
  const gradients = [
    "from-[#1a0f00] to-[#2d1a00]",
    "from-[#0a1a0a] to-[#0f2a0f]",
    "from-[#0d0a1a] to-[#1a1030]",
    "from-[#1a0a0a] to-[#2d1010]",
    "from-[#0a1510] to-[#0f2520]",
    "from-[#1a1200] to-[#2d2000]",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative border border-[var(--hairline)] bg-[var(--surface-raised)] overflow-hidden cursor-pointer"
      style={{ borderRadius: 0 }}
    >
      {/* Image / gradient area */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Malt accent line on hover */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--malt)]"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Year badge */}
        <div className="absolute top-4 right-4">
          <span className="font-mono-folio text-[10px] tracking-[0.12em] uppercase text-white/40">
            {project.year}
          </span>
        </div>

        {/* Index number */}
        <div className="absolute bottom-4 left-4">
          <span
            className="font-mono-folio text-[2.5rem] font-bold leading-none opacity-10 text-white select-none"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(200,169,126,0.08)" }}
            >
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-[#111111] bg-[var(--malt)] hover:bg-[var(--malt-dark)] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Watch Series
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white/60 border border-white/20">
                  Watch Series
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 2l7 4-7 4V2z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-[1rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--ink)] mb-2 group-hover:text-[var(--malt)] transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[0.8125rem] leading-[1.6] text-[var(--ink-soft)] mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 text-[0.625rem] font-mono-folio tracking-[0.06em] uppercase border border-[var(--hairline)] text-[var(--ink-soft)]"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 text-[0.625rem] font-mono-folio tracking-[0.06em] uppercase text-[var(--ink-soft)]">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--malt)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

export function WorksSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="works"
      className="portfolio-section relative bg-[var(--paper)] py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--hairline)]" />

      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="section-index">02 — Vlogs</span>
          <div className="flex-1 h-px bg-[var(--hairline)]" />
          <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)]">
            {data.length} Series
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink)]">
            Featured{" "}
            <span style={{ color: "var(--malt)" }}>series</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--hairline)]">
          {data.map((project, i) => (
            <div key={project.id} className="bg-[var(--paper)]">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--hairline)]" />
    </section>
  );
}
