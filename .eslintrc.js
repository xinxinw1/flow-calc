// @flow

module.exports = {
  ignorePatterns: ['flow-typed/', 'build/'],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'flowtype', 'prettier'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'max-classes-per-file': 'off',
    'no-unused-vars': [
      'error',
      { varsIgnorePattern: '_', argsIgnorePattern: '^_' },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-use-before-define': 'off',
    'no-else-return': 'off',
    'flowtype/require-valid-file-annotation': [
      2,
      'always',
      { annotationStyle: 'line' },
    ],
    'import/prefer-default-export': 'off',
    'no-shadow': ['error', { allow: ['_'] }],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test-helper.js', 'setupTests.js'],
      env: {
        'jest/globals': true,
      },
      extends: ['plugin:jest/style'],
      plugins: ['jest'],
    },
  ],
};
