"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { WorksSection } from "@/components/portfolio/WorksSection";
import { MapSection } from "@/components/portfolio/MapSection";
import { TimelineSection } from "@/components/portfolio/TimelineSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import type { PortfolioData } from "@/lib/portfolio-data";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "works", label: "Vlogs" },
  { id: "places", label: "Locations" },
  { id: "timeline", label: "Journey" },
  { id: "contact", label: "Collabs" },
];

function StickyNav({ activeSection, name }: { activeSection: string; name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const isHero = activeSection === "hero";

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? isHero
              ? "rgba(17,17,17,0.92)"
              : "rgba(253,253,251,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${isHero ? "rgba(255,255,255,0.08)" : "var(--hairline)"}` : "none",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-mono-folio text-[11px] tracking-[0.16em] uppercase font-medium transition-colors duration-200"
            style={{ color: isHero || !scrolled ? "rgba(255,255,255,0.8)" : "var(--ink)" }}
          >
            ASH
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-mono-folio text-[10px] tracking-[0.12em] uppercase transition-colors duration-200 relative"
                style={{
                  color:
                    activeSection === item.id
                      ? "var(--malt)"
                      : isHero || !scrolled
                      ? "rgba(255,255,255,0.45)"
                      : "var(--ink-soft)",
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-px"
                    style={{ background: "var(--malt)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-px"
              style={{ background: isHero || !scrolled ? "rgba(255,255,255,0.7)" : "var(--ink)" }}
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }}
            />
            <motion.span
              className="block w-5 h-px"
              style={{ background: isHero || !scrolled ? "rgba(255,255,255,0.7)" : "var(--ink)" }}
              animate={{ opacity: menuOpen ? 0 : 1 }}
            />
            <motion.span
              className="block w-5 h-px"
              style={{ background: isHero || !scrolled ? "rgba(255,255,255,0.7)" : "var(--ink)" }}
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 bg-[#111111] border-b border-white/10"
          >
            <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left py-3 font-mono-folio text-[11px] tracking-[0.14em] uppercase border-b border-white/5 last:border-0 transition-colors duration-200"
                  style={{
                    color: activeSection === item.id ? "var(--malt)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side dot navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            title={item.label}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background:
                activeSection === item.id
                  ? "var(--malt)"
                  : "rgba(255,255,255,0.25)",
              transform: activeSection === item.id ? "scale(1.5)" : "scale(1)",
              boxShadow: activeSection === item.id ? "0 0 8px var(--malt)" : "none",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeSection, setActiveSection] = useState("hero");

  // Fetch portfolio data
  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setData(d as PortfolioData);
      })
      .catch(() => {
        // Silently fail — data will remain null and we show loading
      });
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-8 h-8 border border-[var(--malt)] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-mono-folio text-[10px] tracking-[0.16em] uppercase text-white/30">
            Loading
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative">
      <StickyNav activeSection={activeSection} name={data.hero.name} />

      <HeroSection data={data.hero} />
      <AboutSection data={data.about} />
      <WorksSection data={data.works} />
      <MapSection data={data.places} />
      <TimelineSection data={data.timeline} />
      <ContactSection email={data.about.email} location={data.about.location} name={data.hero.name} />
    </main>
  );
}
