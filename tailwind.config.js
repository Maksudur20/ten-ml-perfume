/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#894541',
        secondary: '#A86B63',
        accent: '#D4AF8C',
        burgundy: {
          50: '#F9F6F5',
          100: '#F2EEEB',
          200: '#E6D9D5',
          300: '#D4B3AB',
          400: '#C08D83',
          500: '#A86B63',
          600: '#894541',
          700: '#743B38',
          800: '#5F3530',
          900: '#4D2B28',
        },
      },
    },
  },
  plugins: [],
}
