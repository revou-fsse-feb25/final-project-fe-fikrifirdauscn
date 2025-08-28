/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#25283D',
        'light-dark-blue': '#31354F',
        'magenta': '#8F3985',
        'light-text': '#E5E7EB',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};