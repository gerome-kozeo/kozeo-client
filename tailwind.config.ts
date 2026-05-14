import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kozeo: {
          vert: "#00856f",
          "vert-accent": "#3bb386",
          "vert-3": "#68bfa3",
          "vert-4": "#a0d3c0",
          "vert-dark": "#006a55",
          violet: "#181326",
          "violet-clair": "#473e52",
          gris: "#a0a6a1",
          light: "#f2f8f5",
          orange: "#f28a35",
          jaune: "#f2c167",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,19,38,0.04), 0 8px 24px -12px rgba(24,19,38,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
