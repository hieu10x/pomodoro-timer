/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-rapid": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
      },
    },
  },
  plugins: [],
};
