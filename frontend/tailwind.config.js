/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#1f2937",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
    },
  },
  plugins: [],
};
