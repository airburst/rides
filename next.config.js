import bundleAnalyzer from "@next/bundle-analyzer";
await import("./src/env.js");

export const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

export default config;

// Export PWA in production only
// export default process.env.NODE_ENV === "production"
//   ? withPWA(appConfig)
//   : appConfig;
