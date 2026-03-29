/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecf6ff',
          100: '#d8e8ff',
          500: '#1d3fe0',
          700: '#1b43dd'
        }
      },
      boxShadow: {
        soft: '0 12px 32px rgba(22, 28, 37, 0.12)' 
      }
    }
  },
  plugins: [],
};
