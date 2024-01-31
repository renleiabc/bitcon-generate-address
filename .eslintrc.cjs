module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier'
  ],
  env: {
    browser: true,
    amd: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'html/html-extensions': ['.html', '.we'] // consider .html and .we files as HTML
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_'
      }
    ],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
