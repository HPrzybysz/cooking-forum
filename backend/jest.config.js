module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    setupFiles: ['<rootDir>/src/tests/__mocks__/nodemailer.js'],
    globalTeardown: './src/tests/teardown.js',
    testTimeout: 10000,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/config/',
        '/middlewares/',
        '/utils/'
    ],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/**/*.js',
        'routes/**/*.js'
    ],
    modulePathIgnorePatterns: ['<rootDir>/uploads/'],
    detectOpenHandles: true,
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(module-to-transform)/)'
    ]
};
