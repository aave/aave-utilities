module.exports = {
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
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
  globals: {
    'ts-jest': {
      diagnostics: {
        '//':
          'https://github.com/kulshekhar/ts-jest/issues/748#issuecomment-423528659',
        ignoreCodes: [151001],
      },
    },
  },
  coveragePathIgnorePatterns: [],
  modulePathIgnorePatterns: ['node_modules'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
