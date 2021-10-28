import { providers } from 'ethers';
import { LendingPool } from './index';

describe('LendingPool', () => {
  const provider = new providers.JsonRpcProvider();
  const LENDING_POOL = '0x0000000000000000000000000000000000000001';
  const WETH_GATEWAY = '0x0000000000000000000000000000000000000002';
  const FLASH_LIQUIDATION_ADAPTER =
    '0x0000000000000000000000000000000000000003';
  const REPAY_WITH_COLLATERAL_ADAPTER =
    '0x0000000000000000000000000000000000000004';
  const SWAP_COLLATERAL_ADAPTER = '0x0000000000000000000000000000000000000005';

  describe('Initialization', () => {
    const config = {
      LENDING_POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new LendingPool(provider, config);
      expect(instance instanceof LendingPool).toEqual(true);
    });
    it('Expects ot initialize correctly without passing configuration', () => {
      const instance = new LendingPool(provider);
      expect(instance instanceof LendingPool).toEqual(true);
    });
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
  describe('liquidationCall', () => {
    it('Expects the tx object passing all params and no approval needed', async () => {});
    it('Expects the tx object passing all params but not passing getAToken and no approval needed', async () => {});
    it('Expects the tx object passing all params but not passing liquidateAll with approval needed', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when liquidator not and eth address', async () => {});
    it('Expects to fail when liquidatedUser not and eth address', async () => {});
    it('Expects to fail when debtReserve not and eth address', async () => {});
    it('Expects to fail when collateralReserve not and eth address', async () => {});
    it('Expects to fail when purchaseAmount not positive', async () => {});
    it('Expects to fail when purchaseAmount not number', async () => {});
  });
  describe('swapCollateral', () => {
    it('Expects the tx object passing all params and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params without onBehalf and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params without referralCode and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params and no approval needed with flash and swapAll', async () => {});
    it('Expects the tx object passing all params and no approval needed with flash and not swapAll', async () => {});
    it('Expects the tx object passing all params without permitSignature and no approval needed without flash', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when SWAP_COLLATERAL_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when fromAsset not and eth address', async () => {});
    it('Expects to fail when fromAToken not and eth address', async () => {});
    it('Expects to fail when toAsset not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when augustus not and eth address', async () => {});
    it('Expects to fail when fromAmount not positive', async () => {});
    it('Expects to fail when fromAmount not number', async () => {});
    it('Expects to fail when minToAmount not positive', async () => {});
    it('Expects to fail when minToAmount not number', async () => {});
  });
  describe('repayWithCollateral', () => {
    it('Expects the tx object passing all params and no approval needed for flash with rate mode None', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash with rate mode Stable', async () => {});
    it('Expects the tx object passing all params and approval needed for flash with rate mode Variable', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without onBehalfOf', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without referralCode', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without useEthPath', async () => {});
    it('Expects the tx object passing all params and no approval needed without flash and repayAllDebt', async () => {});
    it('Expects the tx object passing all params and no approval needed without flash and not repayAllDebt', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when REPAY_WITH_COLLATERAL_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when fromAsset not and eth address', async () => {});
    it('Expects to fail when fromAToken not and eth address', async () => {});
    it('Expects to fail when assetToRepay not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when repayWithAmount not positive', async () => {});
    it('Expects to fail when repayWithAmount not number', async () => {});
    it('Expects to fail when repayAmount not positive', async () => {});
    it('Expects to fail when repayAmount not number', async () => {});
  });
  describe('flashLiquidation', () => {
    it('Expects the tx object passing all params', async () => {});
    it('Expects the tx object passing all params without useEthPath', async () => {});
    it('Expects the tx object passing all params and liquidateAll to false', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when FLASH_LIQUIDATION_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when collateralAsset not and eth address', async () => {});
    it('Expects to fail when borrowedAsset not and eth address', async () => {});
    it('Expects to fail when initiator not and eth address', async () => {});
    it('Expects to fail when debtTokenCover not positive', async () => {});
    it('Expects to fail when debtTokenCover not number', async () => {});
  });
});
