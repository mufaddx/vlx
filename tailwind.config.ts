import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A12",
          900: "#0B1220",
          800: "#101622",
          700: "#171E2E",
          600: "#243044",
        },
        mist: {
          50: "#F6F7FB",
          100: "#EEF1F7",
          200: "#E2E8F0",
          400: "#9AA3B8",
          500: "#4B5568",
        },
        teal: {
          DEFAULT: "#5EEAD4",
          deep: "#0F766E",
        },
        violet: {
          DEFAULT: "#8B7CFF",
          deep: "#5B4FE0",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 20px 60px rgba(7, 10, 18, 0.35)",
        lift: "0 12px 40px rgba(91, 79, 224, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
