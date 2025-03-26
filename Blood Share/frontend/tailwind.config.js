/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e53e3e',
          dark: '#c53030',
          light: '#fc8181',
        },
        secondary: {
          DEFAULT: '#2b6cb0',
          dark: '#2c5282',
          light: '#63b3ed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

