// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [
        config.eslintReact,
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'import/extensions': 'off',
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/no-unused-vars': 1,
    },
}
