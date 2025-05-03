import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["tailwindcss"],
  images: {
    domains: ["example.com", "images.example.com"],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    MY_API_URL: process.env.MY_API_URL,
  },
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
  },
};

export default nextConfig;
