module.exports = {
  content: [
    './app/**/*.{js,ts,vue}',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007aff',
          light: '#3b82f6',
          dark: '#055aba',
          gradient: '#0c6de3',
        },
        bg: {
          primary: '#000314',
          dark: '#080711',
          darker: '#0a0f1d',
          overlay: 'rgba(0, 0, 0, 0.5)',
          surface: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d2d6db',
          tertiary: '#e5e7eb',
          muted: '#9da4ae',
          placeholder: 'rgba(255, 255, 255, 0.5)',
        },
        accent: {
          'purple': '#9855ff',
          'blue-glow': '#1b68ed',
          'blue-light': '#678fd2',
        },
        border: {
          primary: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.15)',
          light: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(90deg, #080711 0%, #0a0f1d 49%, #020207 100%)',
        'gradient-button': 'linear-gradient(180deg, rgba(241, 241, 241, 0.3) 0%, rgba(153, 153, 153, 0) 100%)',
        'gradient-card': 'conic-gradient(from 180deg at 50% 50%, rgba(47, 81, 140, 0.4) 0deg, rgba(0, 0, 0, 0) 173deg, #3b82f6 281deg, rgba(47, 81, 140, 0.4) 360deg)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000314 100%)',
      },
      boxShadow: {
        'blue': '0px 5px 30px rgba(0, 42, 254, 0.2)',
        'card': '0px 10px 40px rgba(0, 0, 0, 0.3)',
        'glow': '0px 0px 50px rgba(5, 90, 186, 0.5)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        custom: '25px',
        xs: '2px',
      },
    },
  },
  plugins: [],
}
