/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6366f1',
        'brand-secondary': '#8b5cf6',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
      },
    },
  },
  plugins: [],
}
