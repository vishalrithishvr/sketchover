/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#F5007E', dark: '#C70066', light: '#FF4DA6' },
        ink: '#111111',
      },
    },
  },
  plugins: [],
}
