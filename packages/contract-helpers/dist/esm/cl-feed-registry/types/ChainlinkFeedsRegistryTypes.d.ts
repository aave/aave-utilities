import { BigNumber } from 'ethers';
export declare enum Denominations {
  eth = 'eth',
  usd = 'usd',
}
export declare enum DenominationAddresses {
  eth = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  usd = '0x0000000000000000000000000000000000000348',
}
export interface LatestRoundData {
  roundId: BigNumber;
  answer: BigNumber;
  startedAt: BigNumber;
  updatedAt: BigNumber;
  answeredInRound: BigNumber;
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: BigNumber;
}
export interface PriceFeed {
  answer: string;
  updatedAt: number;
  decimals: number;
}
//# sourceMappingURL=ChainlinkFeedsRegistryTypes.d.ts.map
