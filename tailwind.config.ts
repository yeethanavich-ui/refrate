import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        piste: {
          950: "#0B1220", // near-black steel navy — background
          900: "#101A2E",
          800: "#182640",
          700: "#22355A",
        },
        steel: {
          400: "#93A3B8",
          300: "#B7C2D0",
          200: "#DCE3EA",
          100: "#F1F4F7",
        },
        touche: {
          DEFAULT: "#E3402F", // scoring-light red accent
          dim: "#9C2C21",
        },
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
