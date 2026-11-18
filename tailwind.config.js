/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./portfolio.config.ts"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#09090b',
        },
        surface: {
          light: '#f4f4f5',
          dark: '#18181b',
        },
        border: {
          light: '#e4e4e7',
          dark: '#27272a',
        }
      }
    },
  },
  plugins: [],
}
