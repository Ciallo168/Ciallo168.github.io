/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f7f8',
        surface: '#ffffff',
        line: '#e7e7ea',
        line2: '#d5d5da',
        ink: '#17181c',
        ink2: '#4d525a',
        muted: '#8b9099',
        accent: '#3c7a56',
        'accent-soft': '#f0f5f1',
        danger: '#a8453d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
