/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      lg: '700px',
      sm: '200px',
      sm1: '370px',
      sm2: '420px',
    },
    extend:{
      gridTemplateColumns:{
        'laptop' : '15% 40% 45%'
      },
      spacing:{
        '32rem': '38rem'
      },
      colors:{
        'main': '#121212',
        'secondary':'#1e1e1e',
        'dim-white' : '#c4c4c4',
        'dimest' : '#444444',
        'white': '#ffffff'
      }
    }
  },
  plugins: [],
}

