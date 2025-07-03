import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: ['node_modules/*', 'dist/*', '.env', 'coverage', 'logs', '.vscode', 'setup-db.ts'],
    },
    {
        files: ['tests/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.test.json',
            },
            globals: {
                ...globals.jest,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'off',
            // 'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierPlugin.configs.recommended.rules,
            'prettier/prettier': 'error',
        },
    },
];
