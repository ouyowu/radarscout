import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':  ['4.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'h1':       ['3.5rem',   { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2':       ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h3':       ['1.5rem',   { lineHeight: '1.3' }],
        'body-lg':  ['1.125rem', { lineHeight: '1.7' }],
        'body':     ['1rem',     { lineHeight: '1.6' }],
        'label':    ['0.8125rem',{ lineHeight: '1',    letterSpacing: '0.04em' }],
      },
    },
  },
  plugins: [],
}

export default config
