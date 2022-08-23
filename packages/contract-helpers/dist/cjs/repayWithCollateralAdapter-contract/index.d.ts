import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  InterestRate,
  PermitSignature,
  tEthereumAddress,
} from '../commons/types';
import { IRepayWithCollateral } from './typechain/IRepayWithCollateral';
export declare type RepayWithCollateralType = {
  user: tEthereumAddress;
  collateralAsset: tEthereumAddress;
  debtAsset: tEthereumAddress;
  collateralAmount: string;
  debtRepayAmount: string;
  debtRateMode: InterestRate;
  permit: PermitSignature;
  useEthPath?: boolean;
};
export interface RepayWithCollateralAdapterInterface {
  swapAndRepay: (
    args: RepayWithCollateralType,
    txs: EthereumTransactionTypeExtended[],
  ) => EthereumTransactionTypeExtended;
}
export declare class RepayWithCollateralAdapterService
  extends BaseService<IRepayWithCollateral>
  implements RepayWithCollateralAdapterInterface
{
  readonly repayWithCollateralAddress: string;
  constructor(
    provider: providers.Provider,
    repayWithCollateralAddress?: string,
  );
  swapAndRepay(
    {
      user,
      collateralAsset,
      debtAsset,
      collateralAmount,
      debtRepayAmount,
      debtRateMode,
      permit,
      useEthPath,
    }: RepayWithCollateralType,
    txs?: EthereumTransactionTypeExtended[],
  ): EthereumTransactionTypeExtended;
}
//# sourceMappingURL=index.d.ts.map
