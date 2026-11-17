import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc6fd",
          400: "#36a7fa",
          500: "#0c89eb",
          600: "#006cc9",
          700: "#0156a3",
          800: "#064986",
          900: "#0b3d6f",
          950: "#07264a",
        },
        w3c: {
          blue: "#005a9c",
          darkblue: "#003b66",
          gold: "#e6a100",
          green: "#00853f",
          red: "#d32f2f"
        }
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Monaco",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
