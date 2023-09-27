module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ["airbnb-base", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "class-methods-use-this": "off"
  }
};
