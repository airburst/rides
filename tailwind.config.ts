import { fontFamily } from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss/types/config";
import club from "./src/themes/bath";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", ...fontFamily.sans],
      },
      colors: {
        "dark-100": "#171717",
      },
    },
  },
  variants: {
    borderWidth: ["last"],
  },
  daisyui: {
    themes: [{ club }, "dark"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  jit: true,
  // Remove unused styles in production
  purge: {
    mode: 'all',
    preserveHtmlElements: false,
    content: [
      './src/**/*.tsx',
      // Any third party libs that have classes in the HTML
    ],
  },
} satisfies Config;
