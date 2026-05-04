module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^../../../server/src/(.*)$': '<rootDir>/src/$1'
    }
};
