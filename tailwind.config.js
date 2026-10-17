/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        neo: {
          yellow: 'var(--yellow)',
          pink: 'var(--pink)',
          blue: 'var(--blue)',
          green: 'var(--green)',
          orange: 'var(--orange)',
          purple: 'var(--purple)',
        }
      },
      boxShadow: {
        'neo-sm': '3px 3px 0 #111111',
        'neo': '6px 6px 0 #111111',
        'neo-lg': '8px 8px 0 #111111',
        'neo-xl': '12px 12px 0 #111111',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        hand: ['"Caveat"', 'cursive'],
      }
    },
  },
  plugins: [],
}
