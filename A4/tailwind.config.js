/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`], // all .html files
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ["nord"],
  },
  // ...
};