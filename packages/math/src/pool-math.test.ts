import { getLinearBalance } from './pool-math'

describe('pool math', () => {
  it('should compute collateral balance from blockchain data', () => {
    // Data exported from user 0xa5a69107816c5e3dfa5561e6b621dfe6294f6e5b
    // at block number: 11581421
    // reserve: YFI
    const scaledATokenBalance = '161316503206059870'
    const liquidityIndex = '1001723339432542553527150680'
    const currentLiquidityRate = '22461916953455574582370088'
    const lastUpdateTimestamp = 1609673617
    // At a later time, but on the same block
    // expected balance computed with hardhat
    const currentTimestamp = 1609675535
    const expectedATokenBalance = '161594727054623229'
    const underlyingBalance = getLinearBalance(
      scaledATokenBalance,
      liquidityIndex,
      currentLiquidityRate,
      lastUpdateTimestamp,
      currentTimestamp,
    ).toString()
    expect(underlyingBalance).toBe(expectedATokenBalance)
  })
})
