import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import react from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Безопасно извлекаем подмодули (они могут отсутствовать в разных версиях)
const reactPlugins = react.configs?.recommended?.plugins ?? {};
const reactRules = react.configs?.recommended?.rules ?? {};

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Форматирование кода
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

  // Импорт
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

  // React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      ...reactPlugins,                          // все подмодули из пресета
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactRules,                            // все правила из пресета
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
    },
  },

  // Общие правила
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);