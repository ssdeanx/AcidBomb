/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/next.js'],
  globals: {
    React: true,
    JSX: true,
  },
  parserOptions: {
    project: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
