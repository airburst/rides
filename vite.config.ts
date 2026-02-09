import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      spa: { enabled: true },
      prerender: {
        // @ts-expect-error - prerender.routes type is incomplete in @tanstack/react-start
        routes: [],
        crawlLinks: false,
      },
    }),
    viteReact(),
  ],
});

export default config;
