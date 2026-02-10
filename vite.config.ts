import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          // outputPath: "/custom-shell",
          crawlLinks: false,
          retryCount: 0,
        },
      },
    }),
    viteReact(),
    // Only analyze bundle when ANALYZE=true
    // ...(process.env.ANALYZE
    //   ? [
    //       visualizer({
    //         filename: "./dist/stats.html",
    //         open: true,
    //         gzipSize: true,
    //         brotliSize: true,
    //       }),
    //     ]
    //   : []),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks for better caching
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("@tanstack/react-router")) {
              return "router-vendor";
            }
            if (id.includes("markdown-it") || id.includes("turndown")) {
              return "markdown";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (id.includes("rrule")) {
              return "rrule";
            }
          }
        },
      },
      onwarn(warning, warn) {
        // Ignore "unused import" warnings from TanStack packages
        if (
          warning.code === "UNUSED_EXTERNAL_IMPORT" &&
          warning.exporter?.includes("@tanstack")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});

export default config;
