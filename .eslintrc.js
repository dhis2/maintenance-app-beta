const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        '@typescript-eslint/no-explicit-any': 1,
        //     '@typescript-eslint/no-unused-vars': 1,
    },
}
