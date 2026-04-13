/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile @coral-xyz/anchor so Turbopack processes it correctly
  transpilePackages: ["@coral-xyz/anchor"],
};

module.exports = nextConfig;
