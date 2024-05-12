const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Utiliza la clase para el modo oscuro
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#333333',
        primary: '#4A90E2',
        onPrimary: '#FFFFFF',
        accentBlue: '#4D6FFF',
        accentYellow: '#FFD166',
        accentRed: '#FF5E5E',
        accentGreen: '#6EE7B7',
        textPrimary: '#E0E0E0',
        textSecondary: '#BDBDBD',
        error: '#CF6679',
      },
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: ['@tailwindcss/forms', addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}
