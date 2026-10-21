/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Midnight navy field. 900 is the page, 500 is the lightest surface. */
        ink: { 950: '#030711', 900: '#050B16', 800: '#07101F', 700: '#0A1628', 600: '#0F1E33', 500: '#16293F' },
        line: 'rgba(148,180,210,0.14)',
        /* Electric cyan carries emphasis and anything measured. */
        cyan: { 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
        /* Indigo is the quiet secondary: second series in a chart, inactive states. */
        iris: { 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1' },
        sand: '#E8EDF4',
        mute: '#8FA6BF',
        /* Amber flags something proposed rather than measured. Rose flags a hard limit. */
        amber: '#E6A94C',
        rose: '#E07A6B',
      },
      fontFamily: {
        /* Two families. Plus Jakarta Sans carries display and interface, Inter carries
           reading and data, where its larger x-height and tabular figures do more work. */
        display: ['"Plus Jakarta Sans Variable"', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        /* Fluid scale. Upper bounds are deliberately restrained so headings do not
           eat the screen on a large monitor. */
        hero:   ['clamp(2.5rem,6.4vw,4.75rem)',  { lineHeight: '1.0',  letterSpacing: '-0.035em', fontWeight: '800' }],
        sec:    ['clamp(1.75rem,3.1vw,2.6rem)',  { lineHeight: '1.12', letterSpacing: '-0.025em', fontWeight: '700' }],
        sub:    ['clamp(1.15rem,1.8vw,1.45rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        lede:   ['clamp(1.02rem,1.15vw,1.14rem)',{ lineHeight: '1.68', letterSpacing: '-0.005em' }],
        stat:   ['clamp(1.9rem,3.4vw,2.85rem)',  { lineHeight: '1.0',  letterSpacing: '-0.03em',  fontWeight: '800' }],
        statsm: ['clamp(1.35rem,2vw,1.7rem)',    { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        body:   ['0.975rem',  { lineHeight: '1.72' }],
        small:  ['0.875rem',  { lineHeight: '1.62' }],
        micro:  ['0.78rem',   { lineHeight: '1.5' }],
        label:  ['0.69rem',   { lineHeight: '1.3', letterSpacing: '0.15em', fontWeight: '600' }],
        tick:   ['0.72rem',   { lineHeight: '1.2', fontWeight: '500' }],
      },
      maxWidth: { reading: '68ch' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22,0.61,0.36,1)',
        expo: 'cubic-bezier(0.16,1,0.3,1)',
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
