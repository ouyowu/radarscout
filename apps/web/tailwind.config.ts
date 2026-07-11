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
        sans: ['var(--font-source-sans-3)', 'system-ui', 'sans-serif'],
        'rs-display': ['var(--rs-font-display)'],
        'rs-body': ['var(--rs-font-body)'],
      },
      colors: {
        rs: {
          ink: 'var(--rs-ink)',
          forest: {
            900: 'var(--rs-forest-900)',
            700: 'var(--rs-forest-700)',
            500: 'var(--rs-forest-500)',
          },
          sage: {
            200: 'var(--rs-sage-200)',
          },
          terracotta: {
            DEFAULT: 'var(--rs-terracotta)',
            600: 'var(--rs-terracotta-600)',
          },
          sand: {
            50: 'var(--rs-sand-50)',
            100: 'var(--rs-sand-100)',
          },
          cloud: 'var(--rs-cloud)',
          muted: 'var(--rs-muted)',
        },
      },
      borderRadius: {
        'rs-sm': 'var(--rs-radius-sm)',
        'rs-md': 'var(--rs-radius-md)',
        'rs-lg': 'var(--rs-radius-lg)',
        'rs-pill': 'var(--rs-radius-pill)',
      },
      boxShadow: {
        'rs-soft': 'var(--rs-shadow-soft)',
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
