module.exports = {
  mode: 'jit', // enable just-in-time mode
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'class'
  variants: {
    extend: {},
  },
  plugins: []
};
