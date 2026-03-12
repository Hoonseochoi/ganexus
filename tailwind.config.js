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
        navy: {
          900: "#020617",
          800: "#020817",
        },
        electric: {
          500: "#22d3ee",
          600: "#06b6d4",
        },
        glass: {
          800: "rgba(15,23,42,0.7)",
        },
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        glass: "0 18px 45px rgba(15,23,42,0.45)",
      },
    },
  },
  plugins: [],
};

