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

export function augustusFromAmountOffsetFromCalldata(calldata: string): number {
  switch (calldata.slice(0, 10)) {
    case '0xda8567c8': // Augustus V3 multiSwap
      return 100; // 4 + 3 * 32
    case '0x58b9d179': // Augustus V4 swapOnUniswap
      return 4; // 4 + 0 * 32
    case '0x0863b7ac': // Augustus V4 swapOnUniswapFork
      return 68; // 4 + 2 * 32
    case '0x8f00eccb': // Augustus V4 multiSwap
      return 68; // 4 + 2 * 32
    case '0xec1d21dd': // Augustus V4 megaSwap
      return 68; // 4 + 2 * 32
    case '0x54840d1a': // Augustus V5 swapOnUniswap
      return 4; // 4 + 0 * 32
    case '0xf5661034': // Augustus V5 swapOnUniswapFork
      return 68; // 4 + 2 * 32
    case '0x0b86a4c1': // Augustus V5 swapOnUniswapV2Fork
      return 36; // 4 + 1 * 32
    case '0x64466805': // Augustus V5 swapOnZeroXv4
      return 68; // 4 + 2 * 32
    case '0xa94e78ef': // Augustus V5 multiSwap
      return 68; // 4 + 2 * 32
    case '0x46c67b6d': // Augustus V5 megaSwap
      return 68; // 4 + 2 * 32
    case '0xb22f4db8': // directBalancerV2GivenInSwap
      return 68; // 4 + 2 * 32
    case '0x19fc5be0': // directBalancerV2GivenOutSwap
      return 68; // 4 + 2 * 32
    case '0x3865bde6': // directCurveV1Swap
      return 68; // 4 + 2 * 32
    case '0x58f15100': // directCurveV2Swap
      return 68; // 4 + 2 * 32
    case '0xa6866da9': // directUniV3Swap
      return 68; // 4 + 2 * 32
    default:
      throw new Error('Unrecognized function selector for Augustus');
  }
}

export type SwapAndDepositMethodType = {
  user: tEthereumAddress;
  assetToSwapFrom: tEthereumAddress;
  assetToSwapTo: tEthereumAddress;
  amountToSwap: string; // wei
  minAmountToReceive: string; // wei
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

export class LiquiditySwapAdapterService
  extends BaseService<IParaSwapLiquiditySwapAdapter>
  implements LiquiditySwapAdapterInterface
{
  readonly liquiditySwapAdapterAddress: string;

  constructor(
    provider: providers.Provider,
    swapCollateralAdapterAddress?: string,
  ) {
    super(provider, IParaSwapLiquiditySwapAdapter__factory);

    this.liquiditySwapAdapterAddress = swapCollateralAdapterAddress ?? '';

    this.swapAndDeposit = this.swapAndDeposit.bind(this);
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
