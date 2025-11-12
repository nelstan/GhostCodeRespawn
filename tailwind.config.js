/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  plugins: [],
  theme: {
    extend: {
      // Все расширения темы в одном месте!
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        custom: ['Palatino-Linotype', 'sans-serif']
      },
      backgroundImage: {
        'text-gradient': 'linear-gradient(to right, #FF7096, #FF8FAB)'
      },
      components: {
        '.force-break': {
          display: 'block',
          content: '""',
          marginTop: '1em'
        }
      }
    }
  }
}