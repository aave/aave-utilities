describe('LiquiditySwapAdapterService', () => {
  describe('Initialization', () => {
    it('Expects to initialize with full params', () => {});
    it('Expects to initialize without liquiditySwapAdapterAddress', () => {});
  });
  describe('augustusFromAmountOffsetFromCalldata', () => {
    it('Expects 70 when Augustus V3 multiSwap', () => {});
    it('Expects 4 when Augustus V4 swapOnUniswap', () => {});
    it('Expects 38 when Augustus V4 swapOnUniswapFork', () => {});
    it('Expects 68 when Augustus V4 multiSwap', () => {});
    it('Expects 68 when Augustus V4 megaSwap', () => {});
    it('Expects to fail if non recognizable Augustus function selector', () => {});
  });
  describe('swapAndDeposit', () => {
    it('Expects the tx object when sending all correct params', () => {});
    it('Expects recomended gas if approval txs', () => {});
    it('Expects to fail if swapCollateralAdapterAddress not provided', () => {});
    it('Expects to fail if user not address', () => {});
    it('Expects to fail if assetToSwapFrom not address', () => {});
    it('Expects to fail if assetToSwapTo not address', () => {});
    it('Expects to fail if augustus not address', () => {});
    it('Expects to fail if amountToSwap not positive', () => {});
    it('Expects to fail if amountToSwap not number', () => {});
    it('Expects to fail if minAmountToReceive not positive', () => {});
    it('Expects to fail if minAmountToReceive not number', () => {});
  });
});
