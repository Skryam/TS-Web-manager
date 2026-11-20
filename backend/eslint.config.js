import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import security from 'eslint-plugin-security';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', 'generated/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/member-delimiter-style': 'error',
    },
  },

  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      'import-x/order': ['error', { 'newlines-between': 'always' }],
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    plugins: {
      n: nodePlugin,
    },
    rules: {
      'n/no-process-exit': 'error',
      'n/prefer-node-protocol': 'error',
    },
  },

  {
    plugins: {
      security,
    },
    rules: {
      ...security.configs.recommended.rules,
    },
  },

  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);