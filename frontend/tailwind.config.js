/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      "bg-primary": "#ffffff",
      "bg-secondary": "#f0f2f5",
      "bg-third": "#e4e6eb",
      "bg-forth": "#f0f2f5",
      "color-primary": "#050505",
      "color-secondary": "#65676b",
      "divider": "#ced0d4",
     "dark-bg-primary": "#18191a",
      "dark-bg-secondary": "#242526",
      "dark-bg-third": "#3a3b3c",
      "dark-color-primary": "#242526",
      "dark-color-secondary": "#b0b3b8",
      "blue-color": "#1876f2",
      "green-color": "#42b72a",
      "light-blue-color": "#e7f3ff",
      "border-color": "#ccced2",
      "shadow-1": "rgba(0, 0, 0, 0.2)",
      "shadow-2": "rgba(0, 0, 0, 0.1)",
      "shadow-3": "rgba(0, 0, 0, 0.3)",
      "shadow-inset": "rgba(255, 255, 255, 0.5)",
    },
    extend: {},
  },
  plugins: [],
}
