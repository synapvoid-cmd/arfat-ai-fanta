import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "emerald-deep": "var(--emerald-deep)",
        "forest-green": "var(--forest-green)",
        "rich-green": "var(--rich-green)",
        "dark-green": "var(--dark-green)",
        "guarana-red": "var(--guarana-red)",
        "lime-accent": "var(--lime-accent)",
        "fanta-blue": "var(--fanta-blue)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        display: ["var(--font-anton)", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
