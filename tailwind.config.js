module.exports = {
  purge: {
    mode: 'all',
    content: ['./**/**/*.html', './**/**/*.svelte'],

    options: {
      whitelistPatterns: [/svelte-/],
      defaultExtractor: (content) =>
        [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bangarang: {
          light:'#FFFFFF',
          lightEmphasis:'#E6E6E6',
          darkEmphasis:'#808080',
          dark:'#1A1A1A',
          success:'#90FF90',
          failed:'#FF9090'
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
