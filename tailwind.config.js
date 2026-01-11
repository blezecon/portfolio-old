/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',     // laptops
      '2xl': '1536px',  // 1080p desktops
      '3xl': '1920px',  // large desktop
      '4xl': '2560px',  // 2K / ultrawide
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          light: '#818cf8',
          dark: '#3730a3',
        },
        secondary: {
          DEFAULT: '#06b6d4',
          light: '#67e8f9',
          dark: '#0891b2',
        },
        dark: {
          DEFAULT: '#111827',
          light: '#374151',
          '50': 'rgba(17, 24, 39, 0.5)',
          '30': 'rgba(17, 24, 39, 0.3)',
          '10': 'rgba(17, 24, 39, 0.1)',
        },
        light: {
          DEFAULT: '#f9fafb',
          dark: '#f3f4f6',
          '50': 'rgba(249, 250, 251, 0.5)',
          '30': 'rgba(249, 250, 251, 0.3)',
          '10': 'rgba(249, 250, 251, 0.1)',
        },
      },

      fontFamily: {
        sans: ['CustomFont', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['EnchantmentTable', 'sans-serif'],
        logo: ['LogoBlezecon', 'sans-serif'],
        header: ['CustomHeader', 'sans-serif'],
        enchant: ['EnchantmentTable', 'sans-serif'],
        minecraft: ['CustomFont', 'sans-serif'],
      },

      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-very-slow': 'spin 15s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },

      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },

      borderRadius: {
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },

      boxShadow: {
        'light': '0 0 15px rgba(255, 255, 255, 0.3)',
        'color': '0 0 15px rgba(79, 70, 229, 0.5)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      zIndex: {
        '-10': '-10',
      },

      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: '#4f46e5',
              '&:hover': {
                color: '#818cf8',
              },
            },
            h1: { fontFamily: ['CustomHeader', 'sans-serif'].join(',') },
            h2: { fontFamily: ['CustomHeader', 'sans-serif'].join(',') },
            h3: { fontFamily: ['CustomHeader', 'sans-serif'].join(',') },
            h4: { fontFamily: ['CustomHeader', 'sans-serif'].join(',') },
          },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
