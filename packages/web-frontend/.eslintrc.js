module.exports = {
    root: true,
    extends: [
        '@nuxtjs/eslint-config-typescript',
        '@lamiaoy/eslint-config',
    ],
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'import/extensions': 'off',
        'semi': ['error', 'always'],
        "vue/html-indent": ["error", 4]
    },
};
