module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["svelte3", "@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  settings: {
    "svelte3/typescript": require("typescript"),
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  env: {
    mocha: true,
    es6: true,
    node: true,
  },
  rules: {
    "max-len": "off",
    indent: "error",
  },
};
