/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",        // all HTML files in root
    "./assets/**/*.js" // adjust if you have JS files that use Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}