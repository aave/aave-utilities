import { BytesLike, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  PermitSignature,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { LiquiditySwapValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { IParaSwapLiquiditySwapAdapter } from './typechain/IParaSwapLiquiditySwapAdapter';
import { IParaSwapLiquiditySwapAdapter__factory } from './typechain/IParaSwapLiquiditySwapAdapter__factory';

export function augustusFromAmountOffsetFromCalldata(calldata: string) {
  switch (calldata.slice(0, 10)) {
    case '0xda8567c8': // Augustus V3 multiSwap
      return 4 + 32 + 2 * 32;
    case '0x58b9d179': // Augustus V4 swapOnUniswap
      return 4;
    case '0x0863b7ac': // Augustus V4 swapOnUniswapFork
      return 4 + 2 * 32;
    case '0x8f00eccb': // Augustus V4 multiSwap
      return 4 + 32 + 32;
    case '0xec1d21dd': // Augustus V4 megaSwap
      return 4 + 32 + 32;
    default:
      throw new Error('Unrecognized function selector for Augustus');
  }
}

export type SwapAndDepositMethodType = {
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

export default class LiquiditySwapAdapterService
  extends BaseService<IParaSwapLiquiditySwapAdapter>
  implements LiquiditySwapAdapterInterface
{
  readonly liquiditySwapAdapterAddress: string;

  constructor(
    provider: providers.Provider,
    swapCollateralAdapterAddress: string | undefined,
  ) {
    super(provider, IParaSwapLiquiditySwapAdapter__factory);

    this.liquiditySwapAdapterAddress = swapCollateralAdapterAddress ?? '';
  }

  @LiquiditySwapValidator
  public swapAndDeposit(
    @isEthAddress('user')
    @isEthAddress('assetToSwapFrom')
    @isEthAddress('assetToSwapTo')
    @isEthAddress('augustus')
    @isPositiveAmount('amountToSwap')
    @isPositiveAmount('minAmountToReceive')
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
  ): EthereumTransactionTypeExtended {
    const liquiditySwapContract = this.getContractInstance(
      this.liquiditySwapAdapterAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        liquiditySwapContract.populateTransaction.swapAndDeposit(
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          swapAll
            ? augustusFromAmountOffsetFromCalldata(swapCallData as string)
            : 0,
          swapCallData,
          augustus,
          permitParams,
        ),
      from: user,
    });

    return {
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs ?? [],
        txCallback,
        ProtocolAction.swapCollateral,
      ),
    };
  }
}
