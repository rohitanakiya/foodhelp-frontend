/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: ["Instrument Serif", "Georgia", "serif"],
      },
      colors: {
        saffron: {
          50: "#fff9ec",
          100: "#fff0cc",
          200: "#ffe199",
          300: "#ffcc5c",
          400: "#ffb020",
          500: "#f59300",
          600: "#e67700",
          700: "#b85700",
          800: "#8a4200",
          900: "#5f2d00",
        },
        cream: {
          50: "#fdfcf7",
          100: "#faf8ee",
          200: "#f5f0dd",
        },
      },
      backgroundImage: {
        "warm-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,176,32,0.10), transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, rgba(16,185,129,0.06), transparent 70%)",
      },
    },
  },
  plugins: [],
};
