import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F4",
        surface: "#FFFFFF",
        ink: "#1A1A1A",
        muted: "#5C5850",
        cobalt: "#1E3A8A",
        live: "#E63946",
      },
      fontFamily: {
        display: ["Archivo", "Barlow Condensed", "system-ui", "sans-serif"],
        body: ["Inter", "Public Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(20, 20, 20, 0.06), 0 4px 12px rgba(20, 20, 20, 0.04)",
        cardHover: "0 4px 12px rgba(20, 20, 20, 0.10), 0 8px 24px rgba(20, 20, 20, 0.08)",
      },
      keyframes: {
        livePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.15)" },
        },
      },
      animation: {
        livePulse: "livePulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
