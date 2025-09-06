import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const nextConfig: NextConfig = {
  // TypeScript-specific optimizations
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },

  // Enable SWC (written in Rust, faster than Babel)
  swcMinify: true,

  experimental: {
    // Remove swcFileReading as it doesn't exist
    optimizePackageImports: [
      "lodash",
      "@mui/material",
      "@mui/icons-material",
      "three",
      "lucide-react",
    ],
    // Remove turbo config for now as it's causing issues
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Webpack optimizations for TypeScript
  webpack: (config, { buildId, dev, isServer }) => {
    // Alias optimization
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|gif|ico|webp)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);

