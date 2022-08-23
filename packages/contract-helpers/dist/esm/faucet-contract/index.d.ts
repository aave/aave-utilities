import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  LendingPoolMarketConfig,
  tEthereumAddress,
} from '../commons/types';
import { IFaucet } from './typechain/IFaucet';
export declare type FaucetParamsType = {
  userAddress: tEthereumAddress;
  reserve: tEthereumAddress;
  tokenSymbol: string;
};
export interface FaucetInterface {
  mint: (args: FaucetParamsType) => EthereumTransactionTypeExtended[];
}
export declare class FaucetService
  extends BaseService<IFaucet>
  implements FaucetInterface
{
  readonly faucetAddress: string;
  readonly faucetConfig: LendingPoolMarketConfig | undefined;
  constructor(provider: providers.Provider, faucetAddress?: string);
  mint({
    userAddress,
    reserve,
    tokenSymbol,
  }: FaucetParamsType): EthereumTransactionTypeExtended[];
}
//# sourceMappingURL=index.d.ts.map
