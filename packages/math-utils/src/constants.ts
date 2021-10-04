import { valueToBigNumber } from './bignumber';

export const SECONDS_PER_YEAR = valueToBigNumber('31536000');
export const USD_DECIMALS = 8;
export const RAY_DECIMALS = 27;
export const LTV_PRECISION = 4;

// TODO: should go somewhere else, not sure yet where though
export enum Network {
  mainnet = 1,
  // ropsten = '3,
  kovan = 42,
  polygon = 137,
  mumbai = 80001,
  avalanche = 43114,
  fuji = 43113, // avalanche test network
  // eslint-disable-next-line @typescript-eslint/camelcase
  arbitrum_one = 42161,
  // eslint-disable-next-line @typescript-eslint/camelcase
  arbitrum_rinkeby = 421611,
}
