module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:jsdoc/recommended', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'jsdoc/newline-after-description': 'off',
    'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
    'no-prototype-builtins': 'warn',
    'no-restricted-globals': ['error', 'name', 'length'],
    'no-useless-escape': 'warn',
    'prefer-arrow-callback': 'error',
    'prefer-promise-reject-errors': 'warn',
    'require-atomic-updates': 'off',
    'require-jsdoc': 'warn',
    'valid-jsdoc': 'warn',
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        printWidth: 100,
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
    ],
  },
  globals: {},
  overrides: [
    {
      files: ['*.spec.*'],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  plugins: ['jsdoc', 'prettier'],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
    },
  },
}
