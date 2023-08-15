import { BytesLike, PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { PermitSignature, tEthereumAddress } from '../commons/types';
import { WithdrawAndSwapValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { augustusFromAmountOffsetFromCalldata } from '../paraswap-liquiditySwapAdapter-contract';
import {
  ParaSwapWithdrawSwapAdapter,
  ParaSwapWithdrawSwapAdapterInterface,
} from './typechain/ParaSwapWithdrawSwapAdapter';
import { ParaSwapWithdrawSwapAdapter__factory } from './typechain/ParaSwapWithdrawSwapAdapter__factory';

export type WithdrawAndSwapMethodType = {
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

export interface WithdrawSwapAdapterInterface {
  withdrawAndSwap: (args: WithdrawAndSwapMethodType) => PopulatedTransaction;
}

export class WithdrawAndSwapAdapterService
  extends BaseService<ParaSwapWithdrawSwapAdapter>
  implements WithdrawSwapAdapterInterface
{
  readonly withdrawAndSwapAdapterAddress: string;
  readonly contractInterface: ParaSwapWithdrawSwapAdapterInterface;

  constructor(
    provider: providers.Provider,
    withdrawSwapAdapterAddress?: string,
  ) {
    super(provider, ParaSwapWithdrawSwapAdapter__factory);

    this.withdrawAndSwapAdapterAddress = withdrawSwapAdapterAddress ?? '';

    this.contractInterface =
      ParaSwapWithdrawSwapAdapter__factory.createInterface();

    this.withdrawAndSwap = this.withdrawAndSwap.bind(this);
  }

  @WithdrawAndSwapValidator
  public withdrawAndSwap(
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
    }: WithdrawAndSwapMethodType,
  ): PopulatedTransaction {
    const actionTx: PopulatedTransaction = {};

    const txData = this.contractInterface.encodeFunctionData(
      'withdrawAndSwap',
      [
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
      ],
    );

    actionTx.to = this.withdrawAndSwapAdapterAddress;
    actionTx.data = txData;
    actionTx.from = user;

    return actionTx;
  }
}
