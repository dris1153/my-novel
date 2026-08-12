import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `shared` được publish dưới dạng TS nguồn, Next phải tự transpile.
  transpilePackages: ["shared"],
};

export default nextConfig;
