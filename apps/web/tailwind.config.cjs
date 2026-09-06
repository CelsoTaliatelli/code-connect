/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#00090e',
        'dark-gray': '#171d1f',
        'petrol-green': '#132e35',
        offwhite: '#e1e1e1',
        'medium-gray': '#888888',
        highlight: '#81fe88',
      },
      fontFamily: {
        sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
