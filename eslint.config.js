const globals = require('globals');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const importsPlugin = require('eslint-plugin-import');

module.exports = [
    {
        files: ['**/*.js'],
        plugins: {
            'unused-imports': unusedImportsPlugin,
            'import': importsPlugin,
        },
        languageOptions: {
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2021,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es6,
                ...globals.commonjs,
            },
        },
        rules: {
            'no-undef': 'warn',
            'no-unused-vars': 'off', // disable default rule
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            'no-console': 'warn',
            eqeqeq: 'warn',
            curly: 'warn',
            quotes: [
                'error',
                'single',
                { allowTemplateLiterals: true, avoidEscape: false },
            ],
            semi: ['warn', 'always'],
            'no-extra-semi': 'warn',
        },
    },
    {
        files: ['sub/*.js'],
        rules: {
            'no-undef': 'warn',
            'no-console': 'warn',
        },
    },
    {
        files: ['*.ts', '**/*.ts'],
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin,
            'unused-imports': unusedImportsPlugin,
        },
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 2020,
            },
        },
        rules: {
            'no-unused-vars': 'off', // disable default rule
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            semi: ['error', 'always'],
            'no-extra-semi': 'warn',
            curly: 'warn',
            quotes: [
                'error',
                'single',
                { allowTemplateLiterals: true, avoidEscape: true },
            ],
            eqeqeq: 'error',
            indent: 'off', // disable ESLint's indent rule
            '@typescript-eslint/indent': 'off', // disable TS-specific indent rule
            '@typescript-eslint/no-floating-promises': 'error', // enforce async functions to be called with await
            '@typescript-eslint/return-await': 'error', // enforce consistent use of `return await`
            'prettier/prettier': 'warn', // enforce Prettier rules
        },
    },
    {
        ignores: ['dist', 'node_modules', 'resources'],
    },
];
