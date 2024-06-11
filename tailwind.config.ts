import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import club from "./src/themes/bath";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", ...fontFamily.sans],
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
} satisfies Config;
