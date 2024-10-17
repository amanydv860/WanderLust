/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: '#FF385C',
        hc: '#222222',
        pc: '#6A6A6A',
      },
    },
  },
  plugins: [],
}

