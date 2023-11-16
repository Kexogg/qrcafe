/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f5f8f5',
          '100': '#e1eae0',
          '200': '#d3e0d2',
          '300': '#b1c6af',
          '400': '#86a583',
          '500': '#638661',
          '600': '#4f6d4c',
          '700': '#40573e',
          '800': '#354734',
          '900': '#2d3b2c',
          '950': '#151e15',
        },
        accent: {
          '50': '#fcf6f0',
          '100': '#f8ebdc',
          '200': '#f0d3b8',
          '300': '#e6b48b',
          '400': '#da8f5d',
          '500': '#d2723d',
          '600': '#c45c32',
          '700': '#9f462a',
          '800': '#833b29',
          '900': '#6a3224',
          '950': '#391811',
        },
      }
    },
    /*fontFamily: {
      sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans]
    }*/
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme('fontSize.2xl') },
        h2: { fontSize: theme('fontSize.xl') },
        h3: { fontSize: theme('fontSize.lg') }
      });
    })
  ]
}

