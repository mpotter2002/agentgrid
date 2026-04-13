const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@coral-xyz/anchor"],
  turbopack: {
    resolveAlias: {
      "@coral-xyz/anchor": path.resolve(
        __dirname,
        "node_modules/@coral-xyz/anchor/dist/browser/index.js"
      ),
    },
  },
};

module.exports = nextConfig;
