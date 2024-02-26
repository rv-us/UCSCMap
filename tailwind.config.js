console.log(process.env.NODE_ENV);
const purge = process.env.NODE_ENV === 'production' ? true : false;
module.exports = {
  content: ['./build/**/*.html'],
  darkMode: true,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

