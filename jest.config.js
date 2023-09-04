const config = {
    setupFiles: ['whatwg-fetch'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 75,
            lines: 75,
            statements: 75,
        },
    },
}

module.exports = config
