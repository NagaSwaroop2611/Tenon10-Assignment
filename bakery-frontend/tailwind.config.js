/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream:   { DEFAULT: '#FAF6EF', dark: '#F0E8D8' },
        brown:   { DEFAULT: '#3B1F0E', light: '#6B3A2A', medium: '#8B5E3C', pale: '#C4956A' },
        gold:    { DEFAULT: '#D4A853', light: '#E8C47A' },
        sage:    { DEFAULT: '#7A8C6E', light: '#A8B89A' },
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"DM Sans"', 'sans-serif'],
        mono:   ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}