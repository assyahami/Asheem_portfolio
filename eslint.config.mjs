// ESLint 9 flat config. `next lint` was removed in Next 16 — the `lint`
// script runs plain `eslint .` against this config instead.
// eslint-config-next@16 exports a flat config array directly.
import next from "eslint-config-next";

const config = [
  {
    ignores: [".next/", "node_modules/", "next-env.d.ts"],
  },
  ...next,
];

export default config;
