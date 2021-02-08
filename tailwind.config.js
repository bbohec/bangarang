module.exports = {
  darkMode: 'class', // This can be 'media' if preferred.
  purge: [
    './src/**/*.svelte',
    './src/**/*.html',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        bangarang: {
          light:'#FFFFFF',
          lightEmphasis:'#E6E6E6',
          darkEmphasis:'#808080',
          dark:'#1A1A1A',
          success:'#48C948',
          failed:'#CB3939'
        },
      },
    },
  },
  variants: {},
  plugins: [],
}
