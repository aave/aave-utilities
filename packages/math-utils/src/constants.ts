import { valueToBigNumber } from './bignumber';

export const SECONDS_PER_YEAR = valueToBigNumber('31536000');
export const USD_DECIMALS = 8;
export const ETH_DECIMALS = 18;
export const RAY_DECIMALS = 27;
export const LTV_PRECISION = 4;

export enum Network {
  mainnet = 1,
  // ropsten = '3,
  kovan = 42,
  polygon = 137,
  mumbai = 80001,
  avalanche = 43114,
  fuji = 43113, // avalanche test network
  arbitrum_one = 42161,
  arbitrum_rinkeby = 421611,
}

export const incentiveToReserveAddressMap: Record<string, string> = {
  // For stkAave incentives on ETH mainnet, use Aave reserve data
  '0x4da27a545c0c5b758a6ba100e3a049001de870f5':
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  // For incentives data on ETH deposits/borrows on mainnet, use WETH reserve data
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  // For WMATIC incentives on Polygon mainnet, use MATIC reserve data
  '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  // For WMATIC incentives on Mumbai testnet, use MATIC reserve data
  '0x9c3c9283d3e44854697cd22d3faa240cfb032889':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  // For WAVAX incentives on Avalanche mainnet, use WAVAX reserve data
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  // For WAVAX incentives on Fuji testnet, use WAVAX reserve data
  '0xd00ae08403b9bbb9124bb305c09058e32c39a48c':
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
};
