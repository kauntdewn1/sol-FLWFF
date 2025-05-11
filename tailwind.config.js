import { createPreset } from "fumadocs-ui/tailwind-plugin";
const config = require('./src/config');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  presets: [createPreset()],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    "./node_modules/fumadocs-ui/dist/**/*.js",
    // "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/content/**/*.mdx",
  ],
  blocklist: ["collapse"], // Block the collapse class from being generated
  theme: {
    extend: {
      colors: config.theme.colors,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
