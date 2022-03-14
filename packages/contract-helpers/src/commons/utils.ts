import { BigNumber as BigNumberJs } from 'bignumber.js';
import { BigNumber, constants } from 'ethers';
import { GasRecommendationType, ProtocolAction } from './types';

export const valueToWei = (value: string, decimals: number): string => {
  return new BigNumberJs(value).shiftedBy(decimals).toFixed(0);
};

export const canBeEnsAddress = (ensAddress: string): boolean => {
  return ensAddress.toLowerCase().endsWith('.eth');
};

export const decimalsToCurrencyUnits = (
  value: string,
  decimals: number,
): string => new BigNumberJs(value).shiftedBy(decimals * -1).toFixed();
// .div(new BigNumberJs(10).pow(decimals)).toFixed();

export const getTxValue = (reserve: string, amount: string): string => {
  return reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
    ? amount
    : DEFAULT_NULL_VALUE_ON_TX;
};

export const DEFAULT_NULL_VALUE_ON_TX = BigNumber.from(0).toHexString();
export const DEFAULT_APPROVE_AMOUNT = constants.MaxUint256.toString();
export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const SUPER_BIG_ALLOWANCE_NUMBER =
  '11579208923731619542357098500868790785326998466564056403945758400791';
export const API_ETH_MOCK_ADDRESS =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const uniswapEthAmount = '0.1';
export const SURPLUS = '0.05';

export const gasLimitRecommendations: GasRecommendationType = {
  [ProtocolAction.default]: {
    limit: '210000',
    recommended: '210000',
  },
  [ProtocolAction.supply]: {
    limit: '300000',
    recommended: '300000',
  },
  [ProtocolAction.deposit]: {
    limit: '300000',
    recommended: '300000',
  },
  [ProtocolAction.withdraw]: {
    limit: '230000',
    recommended: '300000',
  },
  [ProtocolAction.liquidationCall]: {
    limit: '700000',
    recommended: '700000',
  },
  [ProtocolAction.liquidationFlash]: {
    limit: '995000',
    recommended: '995000',
  },
  [ProtocolAction.repay]: {
    limit: '300000',
    recommended: '300000',
  },
  [ProtocolAction.borrowETH]: {
    limit: '450000',
    recommended: '450000',
  },
  [ProtocolAction.withdrawETH]: {
    limit: '640000',
    recommended: '640000',
  },
  [ProtocolAction.swapCollateral]: {
    limit: '1000000',
    recommended: '1000000',
  },
  [ProtocolAction.repayCollateral]: {
    limit: '700000',
    recommended: '700000',
  },
};

export const mintAmountsPerToken: Record<string, string> = {
  AAVE: valueToWei('100', 18),
  BAT: valueToWei('100000', 18),
  BUSD: valueToWei('10000', 18),
  DAI: valueToWei('10000', 18),
  ENJ: valueToWei('100000', 18),
  KNC: valueToWei('10000', 18),
  LEND: valueToWei('1000', 18), // Not available on v2, but to support v1 faucet
  LINK: valueToWei('1000', 18),
  MANA: valueToWei('100000', 18),
  MKR: valueToWei('10', 18),
  WETH: valueToWei('10', 18),
  REN: valueToWei('10000', 18),
  REP: valueToWei('1000', 18),
  SNX: valueToWei('100', 18),
  SUSD: valueToWei('10000', 18),
  TUSD: '0', // The TusdMinter contract already mints the maximum
  UNI: valueToWei('1000', 18),
  USDC: valueToWei('10000', 6),
  USDT: valueToWei('10000', 6),
  WBTC: valueToWei('1', 8),
  YFI: valueToWei('1', 18),
  ZRX: valueToWei('100000', 18),
  UNIUSDC: valueToWei(uniswapEthAmount, 6),
  UNIDAI: valueToWei(uniswapEthAmount, 18),
  UNIUSDT: valueToWei(uniswapEthAmount, 6),
  UNIDAIETH: valueToWei(uniswapEthAmount, 18),
  UNIUSDCETH: valueToWei(uniswapEthAmount, 18),
  UNISETHETH: valueToWei(uniswapEthAmount, 18),
  UNILENDETH: valueToWei(uniswapEthAmount, 18),
  UNILINKETH: valueToWei(uniswapEthAmount, 18),
  UNIMKRETH: valueToWei(uniswapEthAmount, 18),
  EURS: valueToWei('10000', 2),
  AGEUR: valueToWei('10000', 18),
  BAL: valueToWei('10000', 18),
  CRV: valueToWei('10000', 18),
  DPI: valueToWei('10000', 18),
  GHST: valueToWei('10000', 18),
  JEUR: valueToWei('10000', 18),
  SUSHI: valueToWei('10000', 18),
};

export const augustusToAmountOffsetFromCalldata = (
  calldata: string,
): number => {
  switch (calldata.slice(0, 10)) {
    case '0x935fb84b': // Augustus V5 buyOnUniswap
      return 36; // 4 + 1 * 32
    case '0xc03786b0': // Augustus V5 buyOnUniswapFork
      return 100; // 4 + 3 * 32
    case '0xb2f1e6db': // Augustus V5 buyOnUniswapV2Fork
      return 68; // 4 + 2 * 32
    case '0xb66bcbac': // Augustus V5 buy
      return 164; // 4 + 5 * 32
    default:
      throw new Error('Unrecognized function selector for Augustus');
  }
};
