// eslint-disable-next-line
module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'error',
    'no-console': 'error',
    'no-undef': 'error',
    'camelcase': 'error',
    'no-extra-semi': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'no-var': 'error',
  },
};
