import { providers } from 'ethers';
import {
  BalanceOfResponse,
  BatchBalanceOfResponse,
  UserWalletBalancesResponse,
} from './types/WalletBalanceProviderTypes';
export * from './types/WalletBalanceProviderTypes';
export interface WalletBalanceProviderContext {
  walletBalanceProviderAddress: string;
  provider: providers.Provider;
}
export declare class WalletBalanceProvider {
  private readonly _contract;
  /**
   * Constructor
   * @param context The wallet balance provider context
   */
  constructor(context: WalletBalanceProviderContext);
  /**
   *  Get the balance for a user on a token
   * @param user The user address
   * @param token The token address
   */
  balanceOf(user: string, token: string): Promise<BalanceOfResponse>;
  /**
   *  Get the balance for a user on a token
   * @param users The users addresses
   * @param tokens The tokens addresses
   */
  batchBalanceOf(
    users: string[],
    tokens: string[],
  ): Promise<BatchBalanceOfResponse>;
  /**
   *  Provides balances of user wallet for all reserves available on the pool
   * @param user The user
   * @param lendingPoolAddressProvider The lending pool address provider
   */
  getUserWalletBalancesForLendingPoolProvider(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserWalletBalancesResponse>;
}
//# sourceMappingURL=index.d.ts.map
