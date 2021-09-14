import { BigNumber } from 'ethers';

export type BalanceOfResponse = BigNumber;

export type BatchBalanceOfResponse = BigNumber[];

export interface UserWalletBalancesResponse {
  0: string[];
  1: BigNumber[];
}
