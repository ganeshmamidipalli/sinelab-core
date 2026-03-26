import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FAFAF8",
          secondary: "#F5F4F0",
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E8E5DE",
          light: "#F0EDE6",
        },
        text: {
          primary: "#2D2B28",
          secondary: "#6B6560",
          muted: "#9B9590",
        },
        accent: {
          DEFAULT: "#C4704B",
          light: "#F5EDE8",
          hover: "#B5623F",
          subtle: "rgba(196,112,75,0.08)",
        },
        success: { DEFAULT: "#4A8C6F", light: "#EBF5F0" },
        warning: { DEFAULT: "#B8963E", light: "#FBF6EA" },
        error: { DEFAULT: "#C25B4E", light: "#FBEEEC" },
        info: { DEFAULT: "#5B7FB5", light: "#EDF2F8" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
