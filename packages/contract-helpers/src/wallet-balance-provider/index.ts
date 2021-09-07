import { BigNumber, ethers, providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { abi } from './abi';
import {
  ContractContext,
  GetUserWalletBalancesResponse,
} from './types/WalletBalanceProvider';

export {
  ContractContext,
  GetUserWalletBalancesResponse,
} from './types/WalletBalanceProvider';

export interface WalletBalanceProviderContext {
  walletBalanceProviderAddress: string;
  provider: providers.Provider;
}

export class WalletBalanceProvider {
  private readonly _contract: ContractContext;

  /**
   * Constructor
   * @param context The wallet balance provider context
   */
  public constructor(context: WalletBalanceProviderContext) {
    this._contract = (new ethers.Contract(
      context.walletBalanceProviderAddress,
      abi,
      context.provider,
    ) as unknown) as ContractContext;
  }

  /**
   *  Get the balance for a user on a token
   * @param user The user address
   * @param token The token address
   */
  public async balanceOf(user: string, token: string): Promise<BigNumber> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    if (!isAddress(token)) {
      throw new Error('Token address is not a valid ethereum address');
    }

    return this._contract.balanceOf(user, token);
  }

  /**
   *  Get the balance for a user on a token
   * @param users The users addresses
   * @param tokens The tokens addresses
   */
  public async batchBalanceOf(
    users: string[],
    tokens: string[],
  ): Promise<BigNumber[]> {
    if (!users.every(u => isAddress(u))) {
      throw new Error(
        'One of the user address is not a valid ethereum address',
      );
    }

    if (!tokens.every(u => isAddress(u))) {
      throw new Error(
        'One of the token address is not a valid ethereum address',
      );
    }

    return this._contract.batchBalanceOf(users, tokens);
  }

  /**
   *  Provides balances of user wallet for all reserves available on the pool
   * @param user The user
   * @param lendingPoolAddressProvider The lending pool address provider
   */
  public async getUserWalletBalancesForLendingPoolProvider(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<GetUserWalletBalancesResponse> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error(
        'Lending pool address provider is not a valid ethereum address',
      );
    }

    return this._contract.getUserWalletBalances(
      lendingPoolAddressProvider,
      user,
    );
  }
}
