/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress warnings from WalletConnect logger chain that tries to load pino-pretty
  env: {
    DISABLE_LOGGING_WIZARD: "true",
  },
};

module.exports = nextConfig;
