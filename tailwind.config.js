/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#121316",       // charcoal background
        secondary: "#1E2024",     // concrete grey panel
        panel: "#2D3139",         // steel grey border/element
        accent: "#FFC72C",        // construction safety yellow
        accentDark: "#D9A307",    // hover state yellow
        textDark: "#111827",      // high contrast near-black text
        textLight: "#F3F4F6",     // high contrast near-white text
        textMuted: "#9CA3AF",     // muted/secondary text
        lightBg: "#F4F5F7",       // alternate light section background
      },
      fontFamily: {
        heading: ["'Barlow Condensed'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

