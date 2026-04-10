/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        'surface-dim': "var(--color-surface-dim)",
        'surface-bright': "var(--color-surface-bright)",
        'surface-container-lowest': "var(--color-surface-container-lowest)",
        'surface-container-low': "var(--color-surface-container-low)",
        'surface-container': "var(--color-surface-container)",
        'surface-container-high': "var(--color-surface-container-high)",
        'surface-container-highest': "var(--color-surface-container-highest)",
        primary: "var(--color-primary)",
        'primary-container': "var(--color-primary-container)",
        'on-primary': "var(--color-on-primary)",
        secondary: "var(--color-secondary)",
        'secondary-container': "var(--color-secondary-container)",
        'on-secondary': "var(--color-on-secondary)",
        tertiary: "var(--color-tertiary)",
        outline: "var(--color-outline)",
        'outline-variant': "var(--color-outline-variant)",
        'on-surface': "var(--color-on-surface)",
        'on-surface-variant': "var(--color-on-surface-variant)",
      },
    },
  },
  plugins: [],
}