module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        // 'google',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
    },
    ignorePatterns: [
        '/lib/**/*', // Ignore built files.
    ],
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    rules: {
        'quotes': ['error', 'single'],
        'import/no-unresolved': 0,
        'linebreak-style': 0,
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'class-methods-use-this': 0,
        'no-undef': 0,
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'max-len': ['error', { 'code': 180, 'tabWidth': 4 }],
        'no-useless-constructor': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
        'object-curly-spacing': 0,
    },
};