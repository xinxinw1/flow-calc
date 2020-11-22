module.exports = {
  ignorePatterns: [
    'flow-typed/',
    'build/',
  ],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'flowtype',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'max-classes-per-file': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '_', argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: [
        '**/*.test.js',
      ],
      env: {
        'jest/globals': true,
      },
      extends: [
        'plugin:jest/style',
      ],
      plugins: [
        'jest',
      ],
    },
  ],
};
