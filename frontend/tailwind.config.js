/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff6ed',
          100: '#ffead6',
          200: '#ffd2ad',
          300: '#ffb275',
          400: '#ff8d3d',
          500: '#ff6b0b',
          600: '#f04f00',
          700: '#c73b02',
          800: '#9e310a',
          900: '#7f2a0b',
        },
        ink: '#0f172a',
        canvas: '#fffaf5',
      },
      boxShadow: {
        soft: '0 20px 60px -24px rgba(15, 23, 42, 0.18)',
        glow: '0 16px 40px -18px rgba(255, 107, 11, 0.4)',
      },
      backgroundImage: {
        'brand-grid':
          'radial-gradient(circle at top right, rgba(255,107,11,0.22), transparent 32%), radial-gradient(circle at bottom left, rgba(255,138,61,0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
}

