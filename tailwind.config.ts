import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf6",
          100: "#d6f7e8",
          200: "#aeeed4",
          300: "#78e0ba",
          400: "#3fc99a",
          500: "#1aad7d",
          600: "#0f8c66",
          700: "#0d6f54",
          800: "#0c5844",
          900: "#0a4738",
          950: "#052720",
        },
        ink: {
          50: "#f6f7f8",
          100: "#eceef0",
          400: "#7b8794",
          600: "#4a5560",
          800: "#242b32",
          900: "#151a1f",
          950: "#0c0f12",
        },
        accent: {
          400: "#ffb84d",
          500: "#ff9f1c",
          600: "#e8850a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
