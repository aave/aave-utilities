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
  coveragePathIgnorePatterns: [
    'packages/contract-helpers/src/ui-incentive-data-provider/typechain',
    'packages/contract-helpers/src/wallet-balance-provider/typechain',
    'packages/contract-helpers/src/ui-pool-data-provider/typechain',
    'packages/contract-helpers/src/index.ts',
  ],
  modulePathIgnorePatterns: ['node_modules'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
