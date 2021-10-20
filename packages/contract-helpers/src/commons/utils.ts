import { BigNumber as BigNumberJs } from 'bignumber.js';
import { BigNumber, constants } from 'ethers';
import {
  tStringDecimalUnits,
  ConstantAddressesByNetwork,
  GasRecommendationType,
  Network,
  ProtocolAction,
} from './types';

export const parseNumber = (value: string, decimals: number): string => {
  return new BigNumberJs(value)
    .multipliedBy(new BigNumberJs(10).pow(decimals))
    .toFixed(0);
};

export const canBeEnsAddress = (ensAddress: string): boolean => {
  return ensAddress.toLowerCase().endsWith('.eth');
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

export const cosntantAddressesByNetwork: ConstantAddressesByNetwork = {
  [Network.mainnet]: {
    SYNTHETIX_PROXY_ADDRESS: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  },
};

export const decimalsToCurrencyUnits = (
  value: string,
  decimals: number,
): string =>
  new BigNumberJs(value).div(new BigNumberJs(10).pow(decimals)).toFixed();

export const getTxValue = (reserve: string, amount: string): string => {
  return reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
    ? amount
    : DEFAULT_NULL_VALUE_ON_TX;
};

export const mintAmountsPerToken: Record<string, tStringDecimalUnits> = {
  AAVE: parseNumber('100', 18),
  BAT: parseNumber('100000', 18),
  BUSD: parseNumber('10000', 18),
  DAI: parseNumber('10000', 18),
  ENJ: parseNumber('100000', 18),
  KNC: parseNumber('10000', 18),
  LEND: parseNumber('1000', 18), // Not available on v2, but to support v1 faucet
  LINK: parseNumber('1000', 18),
  MANA: parseNumber('100000', 18),
  MKR: parseNumber('10', 18),
  WETH: parseNumber('10', 18),
  REN: parseNumber('10000', 18),
  REP: parseNumber('1000', 18),
  SNX: parseNumber('100', 18),
  SUSD: parseNumber('10000', 18),
  TUSD: '0', // The TusdMinter contract already mints the maximum
  UNI: parseNumber('1000', 18),
  USDC: parseNumber('10000', 6),
  USDT: parseNumber('10000', 6),
  WBTC: parseNumber('1', 8),
  YFI: parseNumber('1', 18),
  ZRX: parseNumber('100000', 18),
  UNIUSDC: parseNumber(uniswapEthAmount, 6),
  UNIDAI: parseNumber(uniswapEthAmount, 18),
  UNIUSDT: parseNumber(uniswapEthAmount, 6),
  UNIDAIETH: parseNumber(uniswapEthAmount, 18),
  UNIUSDCETH: parseNumber(uniswapEthAmount, 18),
  UNISETHETH: parseNumber(uniswapEthAmount, 18),
  UNILENDETH: parseNumber(uniswapEthAmount, 18),
  UNILINKETH: parseNumber(uniswapEthAmount, 18),
  UNIMKRETH: parseNumber(uniswapEthAmount, 18),
};
