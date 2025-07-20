// tailwind.config.js (Versi baru dengan `content`)
module.exports = {
  content: [
    "./src/script/ss**/*.{js,ts,jsx,tsx}",
    // "./components/**/*.{js,ts,jsx,tsx}",
    ".index.html", // Jangan lupa sertakan file HTML statis
    // ... file lainnya yang berisi class Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
