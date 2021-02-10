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
          light:'#ffffff',
          lightEmphasis:'#aaaaaa',
          darkEmphasis:'#555555',
          dark:'#000000',
          success:'#48C948',
          failed:'#CB3939'
        },
      },
    },
  },
  variants: {},
  plugins: [],
}
