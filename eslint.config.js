const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'bin/**',
      'obj/**',
      '**/*.min.js',
      '**/*.min.css',
      'wwwroot/_framework/**',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        DotNet: 'readonly',
        Blazor: 'readonly',
        alert: 'readonly',
        localStorage: 'readonly',
        JSON: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['wwwroot/js/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        localStorage: 'readonly',
        JSON: 'readonly',
      },
    },
  },
  {
    files: ['*.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
