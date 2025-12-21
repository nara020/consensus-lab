import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode to prevent double Canvas mounting (WebGL context loss)
  reactStrictMode: false,
};

export default nextConfig;
