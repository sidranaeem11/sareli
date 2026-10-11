import type { Config } from 'tailwindcss';

// Poori site ka theme yahan se control hota hai.
// Blue badalna ho to sirf "accent" ki values change karo.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0912',        // page background
        card: '#15111F',       // card background
        line: '#262034',       // thin borders
        cream: '#F5F3FA',      // main text
        muted: '#9A93AD',      // secondary text
        accent: {
          DEFAULT: '#3B82F6',  // buttons, prices, icons
          light: '#60A5FA',    // hover
          deep: '#1D4ED8',     // pressed / gradients
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(59,130,246,0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
