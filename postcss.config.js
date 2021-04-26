const tailwind = require('tailwindcss');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const presetEnv = require('postcss-preset-env')({
  features: {
    'nesting-rules': true, // Optional, not necessary. Read details about it  [here](https://tabatkins.github.io/specs/css-nesting/#motivation) 
  },
});
const plugins =
  process.env.NODE_ENV === 'production'
    ? [postcssImport, tailwind, presetEnv, cssnano]
    : [postcssImport, tailwind, presetEnv];
module.exports = { plugins };