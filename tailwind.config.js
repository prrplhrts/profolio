/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind where to look for your classes
  content: ["./*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        brand: '#4A7387',        // Your original --blue
        'brand-dark': '#3a5c6e', // Your hover blue
        accent: '#FFD966',       // Your original --accent
        graybg: '#f5f5f5',       // Your original --gray-bg
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Add AOS animations if needed here, or keep utilizing the library
    },
  },
  plugins: [],
}