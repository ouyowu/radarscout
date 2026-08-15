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
        'rs-script': ['var(--rs-font-script)'],
      },
      colors: {
        // Channel form so `/opacity` modifiers actually emit a rule; the hex
        // vars in globals.css remain the source of truth for plain CSS.
        rs: {
          ink: 'rgb(var(--rs-ink-rgb) / <alpha-value>)',
          forest: {
            900: 'rgb(var(--rs-forest-900-rgb) / <alpha-value>)',
            800: 'rgb(var(--rs-forest-800-rgb) / <alpha-value>)',
            700: 'rgb(var(--rs-forest-700-rgb) / <alpha-value>)',
            500: 'rgb(var(--rs-forest-500-rgb) / <alpha-value>)',
          },
          sage: {
            200: 'rgb(var(--rs-sage-200-rgb) / <alpha-value>)',
            100: 'rgb(var(--rs-sage-100-rgb) / <alpha-value>)',
          },
          terracotta: {
            DEFAULT: 'rgb(var(--rs-terracotta-rgb) / <alpha-value>)',
            600: 'rgb(var(--rs-terracotta-600-rgb) / <alpha-value>)',
          },
          sand: {
            50: 'rgb(var(--rs-sand-50-rgb) / <alpha-value>)',
            100: 'rgb(var(--rs-sand-100-rgb) / <alpha-value>)',
          },
          cloud: 'rgb(var(--rs-cloud-rgb) / <alpha-value>)',
          muted: 'rgb(var(--rs-muted-rgb) / <alpha-value>)',
          gold: 'rgb(var(--rs-gold-rgb) / <alpha-value>)',
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
