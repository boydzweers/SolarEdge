module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['bin'],
  collectCoverageFrom: ['src/**/*.ts'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 70,
      lines: 85,
      statements: 80,
    },
  },
};
