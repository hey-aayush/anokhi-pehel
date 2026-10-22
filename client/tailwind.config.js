/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    boxShadow: {
      "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
    },
  },
  plugins: [
    // ...
    forms,
  ],
};
