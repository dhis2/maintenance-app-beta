const config = {
    setupFiles: ['whatwg-fetch'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    coverageThreshold: {
        global: {
            branches: 50,

            // TODO: The following should be 75
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
}

module.exports = config
