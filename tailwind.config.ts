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
        background: "var(--background)",
        foreground: "var(--foreground)",
        warlord: {
          primary: '#0f172a',    // slate-900 - dark background
          secondary: '#1e293b',  // slate-800 - cards/surfaces
          accent: '#38bdf8',     // sky-400 - CTA/highlights
          error: '#ef4444',      // red-500
        },
      },
    },
  },
  plugins: [],
};
export default config;
