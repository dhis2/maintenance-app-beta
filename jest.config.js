module.exports = {
    setupFilesAfterEnv: ['./src/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/node_modules/jest-css-modules',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
            './node_modules/@dhis2/cli-app-scripts/config/jest.file.mock.js'
        ),
    },
}
