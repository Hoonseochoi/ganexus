/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ef3b24",
        "brand-gray": "#6d6e71",
        "brand-black": "#000000",
        "brand-gold": "#c49a3a",
        "brand-silver": "#a7a9ac",
        "background-light": "#f8f6f6",
        "background-dark": "#221210",
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        glass: "0 20px 45px rgba(15,23,42,0.25)",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

