/** @type {import('tailwindcss').Config} */
export default {
// search class in all files in folders pages/components/app with matching extension, to convert into css
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#424242', // default black in all the website
        'accent-green': '#1a9e16ff',
      },
    },
  },
  plugins: [],
};