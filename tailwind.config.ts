import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kozeo: {
          vert: "#0FC98A",
          "vert-light": "#51DFAF",
          "vert-dark": "#006A55",
          navy: "#2F2A3C",
          orange: "#F88E33",
          beige: "#FAF7F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
