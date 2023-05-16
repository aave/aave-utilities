module.exports = {
  preset: 'ts-jest',
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
  coveragePathIgnorePatterns: [
    'packages/contract-helpers/src/permissions-manager/typechain',
    'packages/contract-helpers/src/ui-incentive-data-provider/typechain',
    'packages/contract-helpers/src/wallet-balance-provider/typechain',
    'packages/contract-helpers/src/ui-pool-data-provider/typechain',
    'packages/contract-helpers/src/cl-feed-registry/typechain',
    'packages/contract-helpers/src/incentive-controller/typechain',
    'packages/contract-helpers/src/incentive-controller-v2/typechain',
    'packages/contract-helpers/src/erc20-contract/typechain',
    'packages/contract-helpers/src/synthetix-contract/typechain',
    'packages/contract-helpers/src/baseDebtToken-contract/typechain',
    'packages/contract-helpers/src/wethgateway-contract/typechain',
    'packages/contract-helpers/src/paraswap-liquiditySwapAdapter-contract/typechain',
    'packages/contract-helpers/src/staking-contract/typechain',
    'packages/contract-helpers/src/v3-UiPoolDataProvider-contract/typechain',
    'packages/contract-helpers/src/v3-UiIncentiveDataProvider-contract/typechain',
    'packages/contract-helpers/src/governance-contract/typechain',
    'packages/contract-helpers/src/governance-power-delegation-contract/typechain',
    'packages/contract-helpers/src/erc20-2612/typechain',
    'packages/contract-helpers/src/v3-pool-contract/typechain',
    'packages/contract-helpers/src/v3-pool-rollups/typechain',
    'packages/contract-helpers/src/faucet-contract/typechain',
    'packages/contract-helpers/src/uiStakeDataProvider-contract/typechain',
    'packages/contract-helpers/src/repayWithCollateralAdapter-contract/typechain',
    'packages/contract-helpers/src/paraswap-repayWithCollateralAdapter-contract/typechain',
    'packages/contract-helpers/src/lendingPool-contract/typechain',
    'packages/contract-helpers/src/v3-migration-contract/typechain',
    'packages/contract-helpers/src/index.ts',
    'packages/math-utils/src/formatters/reserve/index.ts', // TODO: remove
    'packages/contract-helpers/src/uiStakeDataProvider-contract/index.ts', // TODO: remove
  ],
  modulePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
