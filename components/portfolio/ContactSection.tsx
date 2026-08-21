"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";

interface Props {
  email: string;
  location: string;
  name?: string;
}

export function ContactSection({ email, location, name }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Collab request sent! I'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        let errMsg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string" && data.error.trim()) {
            errMsg = data.error;
          }
        } catch {
          // ignore JSON parse failure
        }
        toast.error(errMsg);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message.trim()
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="portfolio-section relative bg-[var(--paper)] py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--hairline)]" />

      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-16">
            <span className="section-index">05 — Collabs</span>
            <div className="flex-1 h-px bg-[var(--hairline)]" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Info */}
            <div className="lg:col-span-5">
              <motion.h2
                variants={itemVariants}
                className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink)] mb-6"
              >
                Let&apos;s create something{" "}
                <span style={{ color: "var(--malt)" }}>amazing</span>{" "}
                together
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-[0.9375rem] leading-[1.7] text-[var(--ink-soft)] mb-10"
              >
                Looking to collaborate on a brand campaign, sponsored series, or destination content? I work with brands that align with authentic food, travel, and lifestyle storytelling. Let&apos;s build something your audience will love.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 border"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 3l6 4 6-4M1 3h12v8H1V3z" stroke="var(--malt)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono-folio text-[9px] tracking-[0.12em] uppercase text-[var(--ink-soft)] block mb-0.5">
                      Email
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-[0.875rem] text-[var(--ink)] hover:text-[var(--malt)] transition-colors duration-200"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 border"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="var(--malt)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono-folio text-[9px] tracking-[0.12em] uppercase text-[var(--ink-soft)] block mb-0.5">
                      Location
                    </span>
                    <span className="text-[0.875rem] text-[var(--ink)]">{location}</span>
                  </div>
                </div>
              </motion.div>

              {/* Availability indicator */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-3 p-4 border"
                style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#22c55e" }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[0.8125rem] text-[var(--ink-soft)]">
                  Open for brand collaborations
                </span>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-mono-folio text-[9px] tracking-[0.12em] uppercase text-[var(--ink-soft)] block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 text-[0.875rem] bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--malt)] transition-colors duration-200"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="font-mono-folio text-[9px] tracking-[0.12em] uppercase text-[var(--ink-soft)] block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 text-[0.875rem] bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--malt)] transition-colors duration-200"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono-folio text-[9px] tracking-[0.12em] uppercase text-[var(--ink-soft)] block mb-2">
                    Collab Brief
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about your brand, campaign idea, or collab concept..."
                    rows={6}
                    className="w-full px-3 py-2.5 text-[0.875rem] bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--malt)] transition-colors duration-200 resize-none"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono-folio text-[9px] tracking-[0.1em] uppercase text-[var(--ink-soft)]">
                    I reply within 24h
                  </span>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide text-[var(--paper)] bg-[var(--ink)] hover:bg-[var(--malt)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    style={{ borderRadius: 0 }}
                  >
                    {sending ? (
                      <>
                        <motion.span
                          className="w-3 h-3 border border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Collab Request
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-24 border-t border-[var(--hairline)]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)]">
            © {new Date().getFullYear()} — Asheem — All rights reserved
          </span>
          <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)]">
            Food · Travel · Stories
          </span>
        </div>
      </div>
    </section>
  );
}
