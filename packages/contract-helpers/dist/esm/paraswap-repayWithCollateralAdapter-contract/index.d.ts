import { BytesLike, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  InterestRate,
  PermitSignature,
} from '../commons/types';
import { ParaSwapRepayAdapter } from './typechain/ParaSwapRepayAdapter';
export declare type SwapAndRepayType = {
  collateralAsset: string;
  debtAsset: string;
  collateralAmount: string;
  debtRepayAmount: string;
  debtRateMode: InterestRate;
  repayAll: boolean;
  permitParams: PermitSignature;
  swapAndRepayCallData: BytesLike;
  user: string;
  augustus: string;
};
export interface ParaswapRepayWithCollateralInterface {
  swapAndRepay: (
    args: SwapAndRepayType,
    txs?: EthereumTransactionTypeExtended[],
  ) => EthereumTransactionTypeExtended;
}
export declare class ParaswapRepayWithCollateral
  extends BaseService<ParaSwapRepayAdapter>
  implements ParaswapRepayWithCollateralInterface
{
  readonly repayWithCollateralAddress: string;
  constructor(
    provider: providers.Provider,
    repayWithCollateralAddress?: string,
  );
  swapAndRepay(
    {
      collateralAsset,
      debtAsset,
      collateralAmount,
      debtRepayAmount,
      debtRateMode,
      repayAll,
      permitParams,
      swapAndRepayCallData,
      user,
      augustus,
    }: SwapAndRepayType,
    txs?: EthereumTransactionTypeExtended[],
  ): EthereumTransactionTypeExtended;
}
//# sourceMappingURL=index.d.ts.map
