import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `shared` publish dưới dạng TS nguồn, Next phải tự transpile.
  transpilePackages: ["shared"],
  images: {
    // Bìa truyện nằm trên R2 (custom domain hoặc r2.dev). Wildcard để không phải
    // build lại khi đổi domain; tên miền đã được kiểm soát ở phía nguồn dữ liệu.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
