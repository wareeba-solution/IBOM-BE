module.exports = {
    env: {
      node: true,
      commonjs: true,
      es2021: true,
      jest: true,
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
      ecmaVersion: 12,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: 'next|req|res' }],
      'node/no-unsupported-features/es-syntax': 'off',
    },
  };