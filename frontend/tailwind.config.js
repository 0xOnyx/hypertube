/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du design inspiré
        'dark-bg': '#181111',
        'card-bg': '#382929',
        'border-color': '#533c3d',
        'text-secondary': '#b89d9f',
        'accent': '#261c1c',
        'primary-red': '#dc2626'
      },
      fontFamily: {
        'spline': ['Spline Sans', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 