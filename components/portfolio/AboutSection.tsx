"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AboutData } from "@/lib/portfolio-data";

interface Props {
  data: AboutData;
}

export function AboutSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Split bio into paragraphs
  const bioParagraphs = data.bio.split("\n\n").filter(Boolean);

  return (
    <section
      ref={ref}
      id="about"
      className="portfolio-section relative bg-[var(--paper)] py-24 lg:py-32"
    >
      {/* Section rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--hairline)]" />

      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-16">
            <span className="section-index">01 — About</span>
            <div className="flex-1 h-px bg-[var(--hairline)]" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Bio */}
            <div className="lg:col-span-7">
              <motion.h2
                variants={itemVariants}
                className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink)] mb-8"
              >
                Telling stories through food, travel, and{" "}
                <span style={{ color: "var(--malt)" }}>real moments</span>
              </motion.h2>

              {bioParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  variants={itemVariants}
                  className="text-[0.9375rem] leading-[1.7] text-[var(--ink-soft)] mb-4"
                >
                  {para}
                </motion.p>
              ))}

              {/* Meta info */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 mt-8 pt-8 border-t border-[var(--hairline)]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-folio text-[10px] tracking-[0.12em] uppercase text-[var(--ink-soft)] w-20">
                    Location
                  </span>
                  <span className="text-sm text-[var(--ink)]">{data.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-folio text-[10px] tracking-[0.12em] uppercase text-[var(--ink-soft)] w-20">
                    Email
                  </span>
                  <a
                    href={`mailto:${data.email}`}
                    className="text-sm text-[var(--ink)] hover:text-[var(--malt)] transition-colors duration-200 underline underline-offset-2"
                  >
                    {data.email}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right: Skills */}
            <div className="lg:col-span-5">
              <motion.div variants={itemVariants} className="mb-6">
                <span className="font-mono-folio text-[10px] tracking-[0.12em] uppercase text-[var(--ink-soft)]">
                  Gear &amp; Tools
                </span>
              </motion.div>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-[0.6875rem] font-mono-folio tracking-[0.06em] uppercase border border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--malt)] hover:text-[var(--malt)] transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {/* Decorative stat */}
              <motion.div
                variants={itemVariants}
                className="mt-12 p-6 border border-[var(--hairline)] bg-[var(--surface)]"
              >
                <div className="flex items-end gap-2 mb-1">
                  <span
                    className="text-[3rem] font-semibold leading-none tracking-[-0.03em]"
                    style={{ color: "var(--malt)" }}
                  >
                    1M+
                  </span>
                </div>
                <p className="text-[0.8125rem] text-[var(--ink-soft)]">
                  YouTube subscribers and counting
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--hairline)]" />
    </section>
  );
}
