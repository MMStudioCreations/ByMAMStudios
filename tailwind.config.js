/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink:      '#0A0C10',
        navy:     '#0F1423',
        surface:  '#141C28',
        card:     '#1A2235',
        border:   '#1E3060',
        gold:     '#C9A84C',
        goldlt:   '#E8CC7A',
        sienna:   '#C45C28',
        cream:    '#FAF6EF',
        warm:     '#F2EDE4',
        stone:    '#C8C0B4',
        slate:    '#7A7570',
        charcoal: '#2A2520',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
