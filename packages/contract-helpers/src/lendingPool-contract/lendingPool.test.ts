describe('LendingPool', () => {
  describe('Initialization', () => {
    it('Expects to initialize correctly with all params', () => {});
    it('Expects ot initialize correctly without passing configuration', () => {});
  });
  describe('deposit', () => {
    it('Expects the tx object passing all parameters with eth deposit', () => {});
    it('Expects the tx object passing all parameters without approval need', async () => {});
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {});
    it('Expects the tx object passing all parameters but not referral', async () => {});
    it('Expects the tx object passing all parameters and needing approval', async () => {});
    it('Expects the tx object passing all parameters and depositing Synthetix with valid amount', async () => {});
    it('Expects to fail when passing all params and depositing Synthetix but amount not valid', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('withdraw', () => {
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {});
    it('Expects the tx object passing all parameters for eth withdraw', async () => {});
    it('Expects the tx object passing all params and -1 amount', async () => {});
    it('Expects the tx object passing all params and specific', async () => {});
    it('Expects to fail for eth withdraw if not aTokenAddress is passed', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when aTokenAddress not and eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('borrow', () => {
    it('Expects the tx object passing all parameters with borrow eth', async () => {});
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {});
    it('Expects the tx object passing all parameters but not referralCode', async () => {});
    it('Expects the tx object passing all parameters with Interest rate None', async () => {});
    it('Expects the tx object passing all parameters with Interest rate Stable', async () => {});
    it('Expects the tx object passing all parameters with Interest rate Variable', async () => {});
    it('Expects to fail when borrowing eth and not passing debtTokenAddress', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when debtTokenAddress not and eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('repay', () => {
    it('Expects the tx object passing all params with repay eth', async () => {});
    it('Expects the tx object passing all params without onBehalfOf', async () => {});
    it('Expects the tx object passing all params with amount -1 with approve needed', async () => {});
    it('Expects the tx object passing all params with specific amount and no approvals needed', async () => {});
    it('Expects the tx object passing all params with with specific amount and synthetix repayment with valid amount', async () => {});
    it('Expects to fail passing all params with with specific amount and synthetix repayment but not valid amount', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when amount 0', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('swapBorrowRateMode', () => {
    it('Expects the tx object passing all params with Inerest rate None', () => {});
    it('Expects the tx object passing all params with Inerest rate Stable', () => {});
    it('Expects the tx object passing all params with Inerest rate Variable', () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
  });
  describe('setUsageAsCollateral', () => {
    it('Expects the tx object passing all params with usage as collateral true', () => {});
    it('Expects the tx object passing all params with usage as collateral false', () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when reserve not and eth address', async () => {});
  });
  describe('liquidationCall', () => {});
  describe('swapCollateral', () => {});
  describe('repayWithCollateral', () => {});
  describe('flashLiquidation', () => {});
});
