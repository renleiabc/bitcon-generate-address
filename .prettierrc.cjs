module.exports = {
  semi: true,
  endOfLine: "auto",
  singleQuote: true,
  trailingComma: "none",
  bracketSpacing: true,
  vueIndentScriptAndStyle: false,
  jsxBracketSameLine: true,
  htmlWhitespaceSensitivity: "ignore",
  wrapAttributes: true,
  tabWidth: 2,
  printWidth: 120,
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "html",
      },
    },
  ],
};
