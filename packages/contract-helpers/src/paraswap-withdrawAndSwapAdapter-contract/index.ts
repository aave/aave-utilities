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
import { WithdrawAndSwapValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { augustusFromAmountOffsetFromCalldata } from '../paraswap-liquiditySwapAdapter-contract';
import { ParaSwapWithdrawSwapAdapter } from './typechain/ParaSwapWithdrawSwapAdapter';
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
  withdrawAndSwap: (
    args: WithdrawAndSwapMethodType,
    txs?: EthereumTransactionTypeExtended[],
  ) => EthereumTransactionTypeExtended;
}

export class WithdrawAndSwapAdapterService
  extends BaseService<ParaSwapWithdrawSwapAdapter>
  implements WithdrawSwapAdapterInterface
{
  readonly withdrawAndSwapAdapterAddress: string;

  constructor(
    provider: providers.Provider,
    withdrawSwapAdapterAddress?: string,
  ) {
    super(provider, ParaSwapWithdrawSwapAdapter__factory);

    this.withdrawAndSwapAdapterAddress = withdrawSwapAdapterAddress ?? '';

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
    txs?: EthereumTransactionTypeExtended[],
  ): EthereumTransactionTypeExtended {
    const withdrawAndSwapContract = this.getContractInstance(
      this.withdrawAndSwapAdapterAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        withdrawAndSwapContract.populateTransaction.withdrawAndSwap(
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
        ProtocolAction.withdrawAndSwap,
      ),
    };
  }
}
