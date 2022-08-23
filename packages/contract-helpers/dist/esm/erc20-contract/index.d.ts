import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  tEthereumAddress,
} from '../commons/types';
import { IERC20Detailed } from './typechain/IERC20Detailed';
export interface IERC20ServiceInterface {
  decimalsOf: (token: tEthereumAddress) => Promise<number>;
  getTokenData: (token: tEthereumAddress) => Promise<TokenMetadataType>;
  isApproved: (args: ApproveType) => Promise<boolean>;
  approve: (args: ApproveType) => EthereumTransactionTypeExtended;
}
export declare type ApproveType = {
  user: tEthereumAddress;
  token: tEthereumAddress;
  spender: tEthereumAddress;
  amount: string;
};
export declare type TokenMetadataType = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};
export declare class ERC20Service
  extends BaseService<IERC20Detailed>
  implements IERC20ServiceInterface
{
  readonly tokenDecimals: Record<string, number>;
  readonly tokenMetadata: Record<string, TokenMetadataType>;
  constructor(provider: providers.Provider);
  approve({
    user,
    token,
    spender,
    amount,
  }: ApproveType): EthereumTransactionTypeExtended;
  isApproved({ user, token, spender, amount }: ApproveType): Promise<boolean>;
  decimalsOf(token: tEthereumAddress): Promise<number>;
  getTokenData(token: tEthereumAddress): Promise<TokenMetadataType>;
}
//# sourceMappingURL=index.d.ts.map
