module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        '@lamiaoy/eslint-config',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        'import/extensions': ['error', 'always', {
            'js': 'never',
            'ts': 'never',
            'd.ts': 'never',
        }],
    },
    settings: {
        'import/resolver': {
            'node': [
                '.js',
                '.ts',
                '.d.ts',
            ],
        },
    },
};
