import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { ISynthetix } from './typechain/ISynthetix';
export declare const synthetixProxyByChainId: Record<number, string>;
export declare type SynthetixValidationType = {
  user: string;
  reserve: string;
  amount: string;
};
export interface SynthetixInterface {
  synthetixValidation: (args: SynthetixValidationType) => Promise<boolean>;
}
export declare class SynthetixService
  extends BaseService<ISynthetix>
  implements SynthetixInterface
{
  constructor(provider: providers.Provider);
  synthetixValidation({
    user,
    reserve,
    amount,
  }: SynthetixValidationType): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map
