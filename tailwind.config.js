/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /*
       * Colours are CSS variables (src/index.css), so one set of class names serves two
       * rooms: the light reading room (Home, Explore, Sources) and the dark theatre
       * (Watch, under .theme-stage). The names are kept from the earlier dark design so
       * every component keeps its meaning: `ink` is the page and its surfaces, `sand`
       * the main text, `mute` secondary text, `cyan` evidence and links (teal on paper),
       * `amber` something proposed, `rose` a limit.
       */
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)', 900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)', 700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)', 500: 'rgb(var(--ink-500) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        cyan: {
          200: 'rgb(var(--cyan-200) / <alpha-value>)', 300: 'rgb(var(--cyan-300) / <alpha-value>)',
          400: 'rgb(var(--cyan-400) / <alpha-value>)', 500: 'rgb(var(--cyan-500) / <alpha-value>)',
          600: 'rgb(var(--cyan-600) / <alpha-value>)',
        },
        iris: { 300: 'rgb(var(--iris) / <alpha-value>)', 400: 'rgb(var(--iris) / <alpha-value>)', 500: 'rgb(var(--iris) / <alpha-value>)' },
        sand: 'rgb(var(--sand) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        rose: 'rgb(var(--rose) / <alpha-value>)',
        /* Fixed: the theatre and anything laid over a photograph stay dark in both rooms. */
        stage: { DEFAULT: '#0B0F14', ink: '#EDEFF2', mute: '#A3ADBA', accent: '#6FD0C8' },
        accent: { DEFAULT: 'rgb(var(--cyan-500) / <alpha-value>)', bright: 'rgb(var(--cyan-400) / <alpha-value>)' },
        edge: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        /* Source Serif 4 (bundled) sets headings and headline figures. Inter sets reading,
           data and the interface, so `display`, used on buttons, chips and labels, is
           Inter too. Plex Mono is kept for timecodes only. */
        serif: ['"Source Serif 4 Variable"', '"Source Serif Fallback"', 'Georgia', 'Cambria', 'serif'],
        display: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        /* Fluid scale. Upper bounds are deliberately restrained so headings do not
           eat the screen on a large monitor. */
        hero:   ['clamp(2.1rem,3.6vw,3.15rem)',   { lineHeight: '1.06', letterSpacing: '-0.02em',  fontWeight: '600' }],
        sec:    ['clamp(1.8rem,3vw,2.55rem)',    { lineHeight: '1.14', letterSpacing: '-0.015em', fontWeight: '600' }],
        sub:    ['clamp(1.2rem,1.7vw,1.45rem)',  { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        lede:   ['clamp(1.02rem,1.15vw,1.14rem)',{ lineHeight: '1.68', letterSpacing: '-0.005em' }],
        stat:   ['clamp(2.2rem,3.6vw,3rem)',     { lineHeight: '1.0',  letterSpacing: '-0.02em',  fontWeight: '600' }],
        statsm: ['clamp(1.35rem,2vw,1.7rem)',    { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        body:   ['1rem',       { lineHeight: '1.72' }],
        small:  ['0.875rem',  { lineHeight: '1.62' }],
        micro:  ['0.875rem',   { lineHeight: '1.5' }],
        label:  ['0.78rem',   { lineHeight: '1.3', letterSpacing: '0.1em', fontWeight: '600' }],
        tick:   ['0.75rem',   { lineHeight: '1.2', fontWeight: '500' }],
      },
      maxWidth: { reading: '68ch', page: '1200px' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22,0.61,0.36,1)',
        expo: 'cubic-bezier(0.16,1,0.3,1)',
        /* Hover and state changes in CSS. Scroll reveals, counters and the journey
           keep their own curves in motion/react. */
        soft: 'cubic-bezier(0.2,0.7,0.2,1)',
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-14px,0)' } },
        sheen: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
      },
      animation: {
        drift: 'drift 11s ease-in-out infinite',
        sheen: 'sheen 7s linear infinite',
      },
    },
  },
  plugins: [],
}
