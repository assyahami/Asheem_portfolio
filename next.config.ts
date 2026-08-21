import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js dev indicators in the browser console
  devIndicators: false,
  // Next 16.3's `next dev` writes AGENTS.md/CLAUDE.md into the project on
  // boot. In a sandbox those files would be snapshotted to S3 for every
  // tenant app as junk — disable generation.
  agentRules: false,
  // outputFileTracingRoot intentionally NOT set. Inside the sandbox, the
  // app lives at /app, so `path.join(__dirname, "..", "..")` resolved to
  // "/" — the filesystem root — making Next.js treat the entire VM
  // filesystem as the project trace scope. Combined with `poll: 1000`
  // below, that was a sustained memory + CPU drain at compile time.
  // Leaving outputFileTracingRoot unset (Next's default) scopes tracing
  // to the project directory, which is what we want.
  reactStrictMode: true,
  // next-auth@5 beta imports `next/server` without a `.js` extension. Under
  // Turbopack/ESM externals that resolves as ERR_MODULE_NOT_FOUND and 500s
  // every `/api/auth/session` call. Bundling next-auth avoids the broken path.
  transpilePackages: ["next-auth"],
  typescript: {
    ignoreBuildErrors: true,
  },
  // E2B sandboxes are restored from a VM snapshot, which leaves inotify
  // file descriptors stale. This top-level poll is what Turbopack uses so
  // sandbox.files.write() triggers HMR / Fast Refresh.
  //
  // VERSION GATE (verified empirically 2026-08-10): on next@16.3.0 this key
  // is accepted without warning but KILLS file watching entirely — no HMR,
  // no recompiles, dev server serves stale builds forever. Fixed on the
  // 16.3.1 canary line (validated on 16.3.1-canary.9). package.json pins
  // next >=16.3.1 so an image build cannot silently produce a broken
  // template; do not relax that pin without re-running the HMR check.
  watchOptions: {
    pollIntervalMs: 1000,
  },
  // Next 16 enforces cross-origin checks on dev assets (/_next/*) and the
  // HMR websocket. Preview runs on stable proxy hosts ({subdomain}.dev.dual7.app)
  // and sometimes on provider preview URLs — none of those are `localhost`,
  // so without this list the HTML loads but JS/HMR are 403'd.
  allowedDevOrigins: [
    "*.dev.dual7.app",
    "*.dual7.app",
    "*.e2b.app",
    "*.e2b-staging.com",
    "*.modal.host",
    "*.w.modal.host",
    "*.proxy.daytona.work",
    "*.daytonaproxy01.net",
    "*.preview.bl.run",
    "*.lvh.me",
  ],
  // No `webpack` key here, deliberately: Next 16 REFUSES TO START `next dev`
  // when a webpack config is present without a `turbopack` config
  // ("This build is using Turbopack, with a `webpack` config…" — verified
  // 2026-08-10 on 16.3.0). The old webpack-mode polling fallback died with
  // the 15 image; Turbopack polling above is the only watch path now.
};

export default nextConfig;
