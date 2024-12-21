// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    './public/index.html'// Asegurar de que Tailwind procese archivos de React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
