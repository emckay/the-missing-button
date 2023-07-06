/** @type {import('next').NextConfig} */
const path = require("path");

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "api.ts"],
  experimental: {
    // esmExternals: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      excalibur$: path.resolve(
        "./node_modules/excalibur/build/dist/excalibur.js"
      ),
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);
