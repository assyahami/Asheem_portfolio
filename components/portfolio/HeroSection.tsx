"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import type { HeroData } from "@/lib/portfolio-data";

interface Props {
  data: HeroData;
}

// ─── Three.js object factories ───────────────────────────────────────────────

function createCameraObject(): THREE.Group {
  const group = new THREE.Group();

  // Body
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.3,
    metalness: 0.6,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.5), bodyMat);
  group.add(body);

  // Lens
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xc8a97e,
    roughness: 0.2,
    metalness: 0.8,
  });
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.35, 16),
    lensMat
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.35;
  group.add(lens);

  // Viewfinder bump
  const vfMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.4,
    metalness: 0.4,
  });
  const vf = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.08), vfMat);
  vf.position.set(0.3, 0.46, 0);
  group.add(vf);

  // Flash point light (starts at 0 intensity)
  const flash = new THREE.PointLight(0xffffff, 0, 8);
  flash.position.set(0, 0.5, 0.3);
  group.add(flash);

  return group;
}

function createFoodBowl(): THREE.Group {
  const group = new THREE.Group();

  // Bowl (open cylinder)
  const bowlMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e8,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.3, 0.25, 16, 1, true),
    bowlMat
  );
  group.add(bowl);

  // Food mound (half sphere)
  const foodMat = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    roughness: 0.7,
    metalness: 0.0,
  });
  const food = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
    foodMat
  );
  food.position.y = 0.12;
  group.add(food);

  return group;
}

function createVlogIcon(): THREE.Group {
  const group = new THREE.Group();

  // Torus ring
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xc8a97e,
    roughness: 0.3,
    metalness: 0.5,
  });
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.07, 8, 32),
    ringMat
  );
  group.add(ring);

  // Play triangle (BufferGeometry)
  const triGeo = new THREE.BufferGeometry();
  const s = 0.22;
  const vertices = new Float32Array([
    -s * 0.7, -s, 0,
     s * 1.1,  0, 0,
    -s * 0.7,  s, 0,
  ]);
  triGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  triGeo.computeVertexNormals();
  const triMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });
  const tri = new THREE.Mesh(triGeo, triMat);
  tri.position.x = 0.04;
  group.add(tri);

  return group;
}

function createFilmStrip(): THREE.Group {
  const group = new THREE.Group();

  // Base strip
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.2,
  });
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.55, 0.06),
    baseMat
  );
  group.add(base);

  // Frame holes
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
    metalness: 0.0,
  });
  for (let i = 0; i < 4; i++) {
    const hole = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.32, 0.08),
      holeMat
    );
    hole.position.x = -0.57 + i * 0.38;
    hole.position.z = 0.01;
    group.add(hole);
  }

  return group;
}

function createUtensil(): THREE.Group {
  const group = new THREE.Group();

  // Handle
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.7,
  });
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.3, 8),
    handleMat
  );
  group.add(handle);

  // Spoon head
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.2,
    metalness: 0.8,
  });
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 6, 6),
    headMat
  );
  head.position.y = 0.72;
  group.add(head);

  return group;
}

// ─── VloggerThreeCanvas ───────────────────────────────────────────────────────

function VloggerThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xc8a97e, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 50);
    pointLight.position.set(-10, 5, 10);
    scene.add(pointLight);

    // Build 35 falling objects
    type ObjUserData = {
      vy: number;
      rx: number;
      ry: number;
      rz: number;
      isCamera: boolean;
    };

    const objects: THREE.Group[] = [];
    const cameraObjects: THREE.Group[] = [];

    for (let i = 0; i < 35; i++) {
      const r = Math.random();
      let obj: THREE.Group;
      let isCamera = false;

      if (r < 0.25) {
        obj = createCameraObject();
        isCamera = true;
        cameraObjects.push(obj);
      } else if (r < 0.45) {
        obj = createFoodBowl();
      } else if (r < 0.62) {
        obj = createVlogIcon();
      } else if (r < 0.77) {
        obj = createFilmStrip();
      } else {
        obj = createUtensil();
      }

      obj.position.set(
        Math.random() * 30 - 15,
        Math.random() * 40 + 10,
        Math.random() * 8 - 4
      );
      obj.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      (obj.userData as ObjUserData) = {
        vy: 0.02 + Math.random() * 0.03,
        rx: (Math.random() - 0.5) * 0.02,
        ry: (Math.random() - 0.5) * 0.015,
        rz: (Math.random() - 0.5) * 0.01,
        isCamera,
      };

      scene.add(obj);
      objects.push(obj);
    }

    // Mouse parallax
    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 2;
      my = (e.clientY / H - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Camera parallax (lerped)
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-my * 0.3 - camera.position.y) * 0.05;

      // Fall + rotate
      for (const obj of objects) {
        const ud = obj.userData as ObjUserData;
        obj.position.y -= ud.vy;
        obj.rotation.x += ud.rx;
        obj.rotation.y += ud.ry;
        obj.rotation.z += ud.rz;

        if (obj.position.y < -20) {
          obj.position.y = 25 + Math.random() * 15;
          obj.position.x = Math.random() * 30 - 15;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Camera flash effect
    const flashInterval = setInterval(() => {
      if (cameraObjects.length === 0) return;
      const target =
        cameraObjects[Math.floor(Math.random() * cameraObjects.length)];
      const flashLight = target.children.find(
        (c) => c instanceof THREE.PointLight
      ) as THREE.PointLight | undefined;
      if (!flashLight) return;

      const start = performance.now();
      const duration = 400;

      const tweenFlash = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // Triangle wave: 0→1→0
        flashLight.intensity = t < 0.5 ? t * 2 * 4 : (1 - t) * 2 * 4;
        if (t < 1) requestAnimationFrame(tweenFlash);
        else flashLight.intensity = 0;
      };
      requestAnimationFrame(tweenFlash);
    }, 2500 + Math.random() * 2000);

    // Resize
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(flashInterval);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.75 }}
    />
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="cursor-blink inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5" />
      )}
    </span>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection({ data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const stagger = {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
    },
    item: {
      hidden: { opacity: 0, y: 32 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="portfolio-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Three.js WebGL canvas */}
      <VloggerThreeCanvas />

      {/* Ambient malt glow overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(200,169,126,0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(200,169,126,0.05) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Hairline grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Index label */}
          <motion.div variants={stagger.item}>
            <span className="section-index" style={{ color: "var(--malt)" }}>
              00 — Portfolio
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={stagger.item}
            className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
          >
            <Typewriter text={data.name} delay={0.5} />
          </motion.h1>

          {/* Title line */}
          <motion.div
            variants={stagger.item}
            className="flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[var(--malt)] opacity-60" />
            <span
              className="text-[clamp(1.1rem,2.5vw,1.75rem)] font-light tracking-[0.04em]"
              style={{ color: "var(--malt)" }}
            >
              {data.title}
            </span>
            <span className="text-white/40 text-[clamp(1.1rem,2.5vw,1.75rem)] font-light">
              {data.subtitle}
            </span>
            <div className="h-px w-12 bg-[var(--malt)] opacity-60" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={stagger.item}
            className="max-w-xl text-[1rem] leading-relaxed text-white/50 font-light"
          >
            {data.tagline}
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={stagger.item}
            className="flex items-center gap-4 mt-4"
          >
            <a
              href="#works"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide text-[#111111] bg-[var(--malt)] hover:bg-[var(--malt-dark)] transition-colors duration-200"
              style={{ borderRadius: 0 }}
            >
              Watch My Vlogs
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide text-white border border-white/20 hover:border-[var(--malt)] hover:text-[var(--malt)] transition-colors duration-200"
              style={{ borderRadius: 0 }}
            >
              Collab With Me
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={stagger.item}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <span className="font-mono-folio text-[10px] tracking-[0.2em] uppercase text-white/30">
              Scroll
            </span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-[var(--malt)] to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}
