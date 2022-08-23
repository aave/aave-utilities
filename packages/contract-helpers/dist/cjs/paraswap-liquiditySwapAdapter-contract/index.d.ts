import { BytesLike, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  PermitSignature,
  tEthereumAddress,
} from '../commons/types';
import { IParaSwapLiquiditySwapAdapter } from './typechain/IParaSwapLiquiditySwapAdapter';
export declare function augustusFromAmountOffsetFromCalldata(
  calldata: string,
): number;
export declare type SwapAndDepositMethodType = {
  user: tEthereumAddress;
  assetToSwapFrom: tEthereumAddress;
  assetToSwapTo: tEthereumAddress;
  amountToSwap: string;
  minAmountToReceive: string;
  permitParams: PermitSignature;
  swapCallData: BytesLike;
  augustus: tEthereumAddress;
  swapAll: boolean;
};
export interface LiquiditySwapAdapterInterface {
  swapAndDeposit: (
    args: SwapAndDepositMethodType,
    txs?: EthereumTransactionTypeExtended[],
  ) => EthereumTransactionTypeExtended;
}
export declare class LiquiditySwapAdapterService
  extends BaseService<IParaSwapLiquiditySwapAdapter>
  implements LiquiditySwapAdapterInterface
{
  readonly liquiditySwapAdapterAddress: string;
  constructor(
    provider: providers.Provider,
    swapCollateralAdapterAddress?: string,
  );
  swapAndDeposit(
    {
      user,
      assetToSwapFrom,
      assetToSwapTo,
      amountToSwap,
      minAmountToReceive,
      permitParams,
      augustus,
      swapCallData,
      swapAll,
    }: SwapAndDepositMethodType,
    txs?: EthereumTransactionTypeExtended[],
  ): EthereumTransactionTypeExtended;
}
//# sourceMappingURL=index.d.ts.map
