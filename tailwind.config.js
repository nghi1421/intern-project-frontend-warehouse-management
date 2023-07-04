/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, 
  theme: {
    fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      ...colors,
      primary: colors.blue,
      secondary: colors.indigo,
      danger: colors.red,
      warning: colors.amber,
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: []
}

