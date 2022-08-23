import { GasRecommendationType } from './types';
export declare const valueToWei: (value: string, decimals: number) => string;
export declare const canBeEnsAddress: (ensAddress: string) => boolean;
export declare const decimalsToCurrencyUnits: (
  value: string,
  decimals: number,
) => string;
export declare const getTxValue: (reserve: string, amount: string) => string;
export declare const DEFAULT_NULL_VALUE_ON_TX: string;
export declare const DEFAULT_APPROVE_AMOUNT: string;
export declare const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export declare const SUPER_BIG_ALLOWANCE_NUMBER =
  '11579208923731619542357098500868790785326998466564056403945758400791';
export declare const API_ETH_MOCK_ADDRESS =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export declare const uniswapEthAmount = '0.1';
export declare const SURPLUS = '0.05';
export declare const gasLimitRecommendations: GasRecommendationType;
export declare const mintAmountsPerToken: Record<string, string>;
export declare const augustusToAmountOffsetFromCalldata: (
  calldata: string,
) => number;
//# sourceMappingURL=utils.d.ts.map
