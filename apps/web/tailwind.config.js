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
        background: {
          'dark': '#0D0D1A', // Even darker base
          'medium': '#1A1A2E', // Old primary-900, now medium dark
          'light': '#28283A', // Old primary-800, now light dark
          'gradient-start': '#0D0D1A', // Start of the background gradient
          'gradient-end': '#1A0D2E', // A very dark purple for the end of the gradient
        },
        text: {
          'light': '#E0E0EB', // Off-White for light text
          'muted': '#A0A0B0', // Soft Gray for muted text
          'accent': '#8B5CF6', // For links, important labels, or subtle branding
        },
        accent: {
          'main': '#8B5CF6', // Bright Violet for primary actions
          'hover': '#9F7AEA', // Slightly darker violet for hover states
          'bold-hover': '#7A4CD4', // Darker, bolder violet for button hover
          'subtle': '#8B5CF633', // Subtle accent for less emphasis
        },
        border: {
          'subtle': '#1A1A2E', // Same as background.medium for subtle blend
          'medium': '#28283A', // Same as background.light for slightly more prominent
        }
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