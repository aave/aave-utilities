import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { IERC202612 } from './typechain/IERC202612';
export declare type GetNonceType = {
  token: string;
  owner: string;
};
export interface ERC20_2612Interface {
  getNonce: (args: GetNonceType) => Promise<number | null>;
}
export declare class ERC20_2612Service
  extends BaseService<IERC202612>
  implements ERC20_2612Interface
{
  constructor(provider: providers.Provider);
  getNonce({ token, owner }: GetNonceType): Promise<number | null>;
}
//# sourceMappingURL=index.d.ts.map
