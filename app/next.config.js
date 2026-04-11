/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Tell webpack/pino to treat missing optional modules as warnings, not errors
    // This suppresses pino-pretty missing warnings from WalletConnect logger
    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-pretty": false,
    };
    return config;
  },
};

module.exports = nextConfig;
