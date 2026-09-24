import type { NextConfig } from "next"

// GitHub Pages serves a static bundle from the `out/` directory, so the site is
// fully static-exported. All GitHub data is fetched client-side at runtime.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  agentRules: false,
  devIndicators: false,
  // Dev-only: lets the v0 sandbox preview hosts load HMR and font assets.
  allowedDevOrigins: ["*.vercel.run", "*.vusercontent.net", "*.v0.build"],
}

export default nextConfig
