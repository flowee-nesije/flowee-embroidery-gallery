import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm embroidery-inspired palette
        'thread': {
          gold: '#D4A574',
          copper: '#B87333',
          cream: '#FFF8E7',
          sage: '#9CAF88',
          burgundy: '#722F37',
          navy: '#1B365D',
          charcoal: '#36454F',
        },
        'fabric': {
          linen: '#F5F0E6',
          canvas: '#E8DCC4',
          denim: '#1560BD',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Source Sans 3', 'sans-serif'],
        'accent': ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'linen-texture': "url('/textures/linen.svg')",
        'gradient-warm': 'linear-gradient(135deg, #FFF8E7 0%, #F5F0E6 50%, #E8DCC4 100%)',
      },
      animation: {
        'stitch': 'stitch 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        stitch: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
