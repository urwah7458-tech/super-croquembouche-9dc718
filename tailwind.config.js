/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      colors: {
        clinic: {
          ink: "#0d2b2e",
          teal: "#1f6f6b",
          tealdark: "#144a47",
          mist: "#eef5f4",
          sand: "#f7f3ea",
          coral: "#e2725b",
        },
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(13, 43, 46, 0.25)",
      },
    },
  },
  plugins: [],
};
