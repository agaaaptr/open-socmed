
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f7f8f9',
          '100': '#e1e3e6',
          '200': '#c9cdd4',
          '300': '#b1b7c1',
          '400': '#99a1ae',
          '500': '#808b9a',
          '600': '#66707c',
          '700': '#4d555e',
          '800': '#33393f',
          '900': '#191d20',
        },
        accent: {
          '50': '#f0fffc',
          '100': '#d1fff8',
          '200': '#a3fff4',
          '300': '#75fef0',
          '400': '#47feed',
          '500': '#00FFDE',
          '600': '#00e6c8',
          '700': '#00b39d',
          '800': '#008072',
          '900': '#004d46',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'background-pan': 'backgroundPan 10s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        backgroundPan: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        }
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
