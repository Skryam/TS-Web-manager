import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Игнорируем папки, которые не надо проверять
  {
    ignores: ['dist', 'node_modules', 'generated', '*.config.js'],
  },
  
  // Базовые настройки для JS/TS
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig, // Отключаем правила ESLint, которые конфликтуют с Prettier
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Говорим, что мы в браузере (window, document и т.д.)
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect', // Автоматически определяет версию React
      },
    },
    rules: {
      // Твои личные правила
      'react/react-in-jsx-scope': 'off', // Не требовать import React в каждом файле
      '@typescript-eslint/no-unused-vars': 'warn', // Предупреждать о неиспользуемых переменных
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  }
);