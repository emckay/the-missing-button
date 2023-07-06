/** @type {import('next').NextConfig} */
const path = require("path");
const defaultRuntimeCaching = require("next-pwa/cache");

console.log(defaultRuntimeCaching);
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching: [
    // {
    //   urlPattern: /.*\.mp3/,
    //   method: "GET",
    //   handler: "StaleWhileRevalidate",
    //   options: {
    //     cacheName: "audio",
    //     expiration: {
    //       maxEntries: 500,
    //       maxAgeSeconds: 3650 * 24 * 60 * 60,
    //     },
    //   },
    // },
    ...defaultRuntimeCaching,
  ],
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
