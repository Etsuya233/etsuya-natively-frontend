/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace',  'SFMono-Regular', 'Jetbrains Mono', 'Consolas', 'Courier New'],
      'logo': ['Alata']
    },
    extend: {},
  },
  plugins: [require('tailwindcss-primeui'), require('@tailwindcss/typography')],
}

