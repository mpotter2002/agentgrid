/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable Turbopack — use Webpack for build
  experimental: {
    turbo: undefined,
  },
};

module.exports = nextConfig;
