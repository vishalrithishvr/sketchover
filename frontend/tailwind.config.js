/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F5007E',   // magenta accent — icons, stars, coupon button
          dark: '#C70066',
          light: '#FF4DA6',
        },
        whatsapp: '#2E8B7A',    // teal checkout button
        ink: '#111111',         // near-black used for buttons/type
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
}
