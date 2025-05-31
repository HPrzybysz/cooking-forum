module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    globalTeardown: './src/tests/teardown.js',
    testTimeout: 10000,
    detectOpenHandles: true,
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(module-to-transform)/)'
    ]
};