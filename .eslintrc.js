module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb/hooks",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-use-before-define": "off",
    quotes: "off",
    "react/jsx-filename-extension": "off",
    "arrow-body-style": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-console": "off",
    "spaced-comment": "off",
    "implicit-arrow-linebreak": "off",
    "comma-dangle": "off",
    "function-paren-newline": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-useless-return": "off",
    "no-else-return": "off",
    "no-param-reassign": "off",
  },
};
