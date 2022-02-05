const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  purge: ["./src/**/*.{js,ts}", "./*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
