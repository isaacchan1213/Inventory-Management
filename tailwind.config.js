/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        default: '#F5F5DC',
        primary: '#369',
        secondary: '#adf',
      },
      spacing: {
        'size': '300px',
      },
      fontSize: {
        'progress': 'calc(300px / 5)',
      },
      animation: {
        progress: 'progress 2s 0.5s forwards',
      },
      keyframes: {
        progress: {
          '0%': { '--percentage': '0' },
          '100%': { '--percentage': 'var(--value)' },
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '[role="progressbar"]': {
          '--percentage': 'var(--value)',
          '--primary': '#369',
          '--secondary': '#adf',
          '--size': '300px',
          animation: 'progress',
          width: 'var(--size)',
          aspectRatio: '2 / 1',
          borderRadius: '50% / 100% 100% 0 0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        },
        '[role="progressbar"]::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'conic-gradient(from 0.75turn at 50% 100%, var(--primary) calc(var(--percentage) * 1% / 2), var(--secondary) calc(var(--percentage) * 1% / 2 + 0.1%))',
          mask: 'radial-gradient(at 50% 100%, white 55%, transparent 55.5%)',
          maskMode: 'alpha',
          '-webkit-mask': 'radial-gradient(at 50% 100%, #0000 55%, #000 55.5%)',
          '-webkit-mask-mode': 'alpha',
        },
        'body': {
          margin: '0',
          display: 'grid',
          placeItems: 'center',
          height: '100vh',
          background: '#f0f8ff',
        },
      });
    },
  ],
}