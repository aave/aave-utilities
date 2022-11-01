module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['packages/*/src/**(!typechain)/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/contract-helpers/src/index.ts',
    '<rootDir>/packages/math-utils/src/formatters/reserve/index.ts', // TODO: remove
  ],
  modulePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
