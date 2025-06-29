/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        primary: "#ef4444", // red-500
        secondary: "#9ca3af",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        code: ["Fira Code", "monospace"]
      }
    },
  },
  darkMode: "class",
   plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
