/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Animation classes that might be purged
    'animate-fade-in-up',
    'animate-fade-in-down',
    'animate-fade-in-scale',
    'animate-slide-in-left',
    'animate-slide-in-right',
    'animate-shimmer',
    'animate-glow',
    'animate-float',
    'animate-float-slow',
    'animate-pulse-ring',
    'animate-sparkle',
    'animate-text-reveal',
    'animate-border-glow',
    'animate-count-up',
    'animate-gradient-shift',
    'animate-ruby-rotate',
    'text-shimmer',
    'hover-lift',
    'hover-glow',
    'glass',
    'particles-container',
    'particle',
    // Delay classes
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-600',
    'delay-700',
    'delay-800',
    'delay-1000',
    'delay-1200',
  ],
  theme: {
    extend: {
      colors: {
        ruby: {
          50: '#fef2f4',
          100: '#fde6ea',
          200: '#fbd0d9',
          300: '#f7aabb',
          400: '#f27a96',
          500: '#e84c72',
          600: '#E31B54',
          700: '#c01445',
          800: '#a01440',
          900: '#88153c',
          950: '#4c061c',
        },
        dark: {
          900: '#0F0F0F',
          800: '#1A1A1A',
          700: '#252525',
          600: '#333333',
        }
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'text-reveal': 'textReveal 1s ease-out forwards',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out forwards',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'ruby-rotate': 'rubyRotate 5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(45deg)' },
          '50%': { transform: 'translateY(-20px) rotate(45deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInScale: {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-60px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(60px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        sparkle: {
          '0%, 100%': {
            opacity: '0',
            transform: 'scale(0) rotate(0deg)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1) rotate(180deg)',
          },
        },
        textReveal: {
          from: {
            opacity: '0',
            transform: 'translateY(100%)',
            filter: 'blur(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
            filter: 'blur(0)',
          },
        },
        borderGlow: {
          '0%, 100%': {
            borderColor: 'rgba(227, 27, 84, 0.3)',
            boxShadow: '0 0 20px rgba(227, 27, 84, 0.1)',
          },
          '50%': {
            borderColor: 'rgba(227, 27, 84, 0.6)',
            boxShadow: '0 0 40px rgba(227, 27, 84, 0.3)',
          },
        },
        countUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px) scale(0.8)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rubyRotate: {
          '0%': {
            transform: 'rotate(45deg) scale(1)',
            filter: 'brightness(1)',
          },
          '25%': {
            transform: 'rotate(50deg) scale(1.1)',
            filter: 'brightness(1.2)',
          },
          '50%': {
            transform: 'rotate(45deg) scale(1)',
            filter: 'brightness(1)',
          },
          '75%': {
            transform: 'rotate(40deg) scale(1.1)',
            filter: 'brightness(1.2)',
          },
          '100%': {
            transform: 'rotate(45deg) scale(1)',
            filter: 'brightness(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
