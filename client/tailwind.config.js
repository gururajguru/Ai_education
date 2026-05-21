/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#030014",
        cardBg: "rgba(13, 9, 36, 0.4)",
        primaryGlow: "#00f2fe",
        secondaryGlow: "#4facfe",
        neonPurple: "#8a2be2",
        neonPink: "#ff007f",
        neonGreen: "#39ff14",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.5)',
        'neon-purple': '0 0 15px rgba(138, 43, 226, 0.5)',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.5)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.5)',
      }
    },
  },
  plugins: [],
}
