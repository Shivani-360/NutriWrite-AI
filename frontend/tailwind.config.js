/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Fresh Harvest palette — brand scale reworked from generic green
        // to an avocado green. 600 stays the "default" shade so existing
        // bg-brand-600 buttons etc. update automatically, no markup changes needed.
        brand: {
          50:  "#F3F7ED",
          100: "#E3EDD3",
          200: "#C7DBA8",
          300: "#A9C57F",
          400: "#8CAE5D",
          500: "#6B8F47",
          600: "#5B8A3A",
          700: "#4F6B3A",
          800: "#3E5A2E",
          900: "#2F4423",
        },
        // Turmeric — warm accent, used for "Casual" tone tag, highlights, Sprout accents
        accent: {
          50:  "#FEF6E7",
          100: "#FCE9C3",
          200: "#F8D48C",
          300: "#F5BD5B",
          400: "#F2A93B",
          500: "#E0932A",
          600: "#C97F1E",
          700: "#A66418",
          800: "#7D4A12",
          900: "#54310C",
        },
        // Berry — deeper accent, used for "Professional" tone tag
        berry: {
          50:  "#FBEEF2",
          100: "#F3D6E1",
          200: "#E4A8C0",
          300: "#D07AA0",
          400: "#BD5786",
          500: "#A8446B",
          600: "#8C3459",
          700: "#6E2846",
          800: "#521D34",
          900: "#391323",
        },
        // Cream paper background — used for light-mode page background instead of plain white
        paper: {
          DEFAULT: "#FBF6EC",
          dark: "#F2EAD9",
        },
        // Warm near-black text, replacing plain gray-900 where you want the "food" feel
        ink: {
          DEFAULT: "#2B2A25",
          dim: "#6B6759",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "serif"], // use as `font-display` for headlines only
      },
    },
  },
  plugins: [],
};