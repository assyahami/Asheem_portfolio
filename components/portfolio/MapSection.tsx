"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Place } from "@/lib/portfolio-data";

interface Props {
  data: Place[];
}

// Convert lat/lng to SVG coordinates for a simple equirectangular projection
function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

function WorldMapCanvas({ places, onPinClick }: { places: Place[]; onPinClick: (p: Place) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 400 });
  const [droppedPins, setDroppedPins] = useState<Set<string>>(new Set());
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ w: rect.width, h: rect.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Drop pins one by one when in view
  useEffect(() => {
    if (!isInView) return;
    places.forEach((place, i) => {
      setTimeout(() => {
        setDroppedPins((prev) => new Set([...prev, place.id]));
      }, 400 + i * 180);
    });
  }, [isInView, places]);

  // Draw the world map on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = dimensions;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, w, h);

    // Grid lines (latitude/longitude)
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;

    // Longitude lines
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = ((lng + 180) / 360) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Latitude lines
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = ((90 - lat) / 180) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw simplified continent shapes using filled polygons
    const continents: Array<Array<[number, number]>> = [
      // North America
      [[-168,72],[-140,70],[-120,60],[-100,50],[-80,45],[-70,42],[-65,44],[-60,46],[-55,50],[-52,55],[-60,60],[-70,65],[-80,70],[-100,72],[-120,72],[-140,72],[-160,72],[-168,72]],
      // South America
      [[-80,12],[-70,5],[-60,-5],[-50,-15],[-40,-25],[-35,-35],[-40,-45],[-50,-55],[-60,-55],[-70,-50],[-75,-40],[-78,-30],[-80,-20],[-80,-10],[-80,0],[-80,12]],
      // Europe
      [[0,50],[10,55],[20,58],[30,60],[28,65],[20,68],[10,65],[0,60],[-5,55],[0,50]],
      // Africa
      [[-18,15],[-10,5],[0,-5],[10,-15],[20,-25],[30,-30],[35,-20],[40,-10],[42,5],[40,15],[30,22],[20,25],[10,20],[0,15],[-10,10],[-18,15]],
      // Asia
      [[30,70],[60,72],[90,72],[120,70],[140,65],[150,55],[140,45],[130,35],[120,25],[110,15],[100,5],[90,10],[80,20],[70,25],[60,30],[50,35],[40,40],[30,45],[25,50],[30,55],[30,70]],
      // Australia
      [[115,-22],[120,-18],[130,-15],[140,-18],[150,-22],[155,-28],[150,-35],[140,-38],[130,-35],[120,-30],[115,-25],[115,-22]],
      // Greenland
      [[-50,60],[-30,62],[-20,68],[-25,75],[-40,80],[-55,78],[-60,72],[-55,65],[-50,60]],
    ];

    continents.forEach((points) => {
      if (points.length < 3) return;
      ctx.beginPath();
      const first = latLngToXY(points[0][1], points[0][0], w, h);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const pt = latLngToXY(points[i][1], points[i][0], w, h);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Equator line
    const eqY = ((90 - 0) / 180) * h;
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(w, eqY);
    ctx.strokeStyle = "rgba(200,169,126,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [dimensions]);

  const { w, h } = dimensions;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "420px" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* SVG overlay for pins */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        {places.map((place) => {
          const { x, y } = latLngToXY(place.lat, place.lng, w, h);
          const dropped = droppedPins.has(place.id);

          return (
            <g key={place.id} style={{ cursor: "pointer" }} onClick={() => onPinClick(place)}>
              {/* Ripple rings */}
              {dropped && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="none"
                    stroke="rgba(200,169,126,0.4)"
                    strokeWidth="1"
                    style={{
                      animation: "ripple 2s ease-out infinite",
                      transformOrigin: `${x}px ${y}px`,
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="none"
                    stroke="rgba(200,169,126,0.2)"
                    strokeWidth="1"
                    style={{
                      animation: "ripple 2s ease-out 0.6s infinite",
                      transformOrigin: `${x}px ${y}px`,
                    }}
                  />
                </>
              )}

              {/* Pin dot */}
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={dropped ? "var(--malt)" : "transparent"}
                stroke={dropped ? "var(--malt)" : "transparent"}
                strokeWidth="1.5"
                style={{
                  transition: "all 0.3s ease",
                  filter: dropped ? "drop-shadow(0 0 6px rgba(200,169,126,0.6))" : "none",
                }}
              />

              {/* Center dot */}
              {dropped && (
                <circle cx={x} cy={y} r="1.5" fill="#111111" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MapSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <section
      ref={ref}
      id="places"
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
            03 — Filming Locations
          </span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-white/30">
            {data.length} Locations
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Places I&apos;ve{" "}
            <span style={{ color: "var(--malt)" }}>filmed</span>
          </h2>
          <p className="mt-3 text-[0.875rem] text-white/40">
            Click a pin to see what I filmed there.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="border border-white/10 overflow-hidden mb-8"
        >
          <WorldMapCanvas places={data} onPinClick={setSelectedPlace} />
        </motion.div>

        {/* Selected place info */}
        <AnimatePresence mode="wait">
          {selectedPlace && (
            <motion.div
              key={selectedPlace.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="border border-[var(--malt)]/30 bg-white/5 p-5 mb-8 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--malt)" }}
                  />
                  <span className="text-white font-semibold text-[0.9375rem]">
                    {selectedPlace.name}
                  </span>
                  <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-white/40">
                    {selectedPlace.country}
                  </span>
                  <span className="font-mono-folio text-[10px] tracking-[0.1em] uppercase" style={{ color: "var(--malt)" }}>
                    {selectedPlace.year}
                  </span>
                </div>
                {selectedPlace.note && (
                  <p className="text-[0.8125rem] text-white/50 ml-5">{selectedPlace.note}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Place list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        >
          {data.map((place, i) => (
            <motion.button
              key={place.id}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.04 }}
              onClick={() => setSelectedPlace(place)}
              className={`text-left p-3 border transition-colors duration-200 ${
                selectedPlace?.id === place.id
                  ? "border-[var(--malt)] bg-[var(--malt)]/10"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: selectedPlace?.id === place.id ? "var(--malt)" : "rgba(255,255,255,0.3)" }}
                />
                <span className="text-[0.8125rem] font-medium text-white truncate">
                  {place.name}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-3.5">
                <span className="font-mono-folio text-[9px] tracking-[0.08em] uppercase text-white/30 truncate">
                  {place.country}
                </span>
                <span className="font-mono-folio text-[9px] tracking-[0.08em] uppercase" style={{ color: "var(--malt)", opacity: 0.7 }}>
                  {place.year}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}
