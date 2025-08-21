/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{razor,html,cshtml}",
    "./wwwroot/**/*.{html,js}",
    "./Pages/**/*.razor",
    "./*.razor",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
