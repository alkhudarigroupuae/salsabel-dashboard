import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 3%)",
        foreground: "hsl(0 0% 98%)",
        border: "hsl(0 0% 15%)",
        muted: "hsl(0 0% 12%)",
        accent: "hsl(0 0% 18%)",
        primary: {
          DEFAULT: "#FACC15"
        }
      },
      borderRadius: {
        none: "0px"
      }
    }
  },
  plugins: []
};

export default config;
