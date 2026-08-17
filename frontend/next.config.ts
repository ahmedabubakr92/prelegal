import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lib/read-template.server.ts reads templates/Mutual-NDA.md from the repo
  // root at request time. Output file tracing only bundles files reachable
  // via static import analysis, so this file (outside the Next.js project
  // root) needs to be listed explicitly or serverless deploys will 500.
  // Tracing from the monorepo root lets the include glob below reach it.
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/": ["../templates/**"],
  },
};

export default nextConfig;
