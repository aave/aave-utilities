import { BytesLike, PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { PermitSignature, tEthereumAddress } from '../commons/types';
import { WithdrawAndSwitchValidator } from '../commons/validators/methodValidators';
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

export type WithdrawAndSwitchMethodType = {
  user: tEthereumAddress;
  assetToSwitchFrom: tEthereumAddress;
  assetToSwitchTo: tEthereumAddress;
  amountToSwitch: string; // wei
  minAmountToReceive: string; // wei
  permitParams: PermitSignature;
  switchCallData: BytesLike;
  augustus: tEthereumAddress;
  switchAll: boolean;
};

export interface WithdrawSwitchAdapterInterface {
  withdrawAndSwitch: (
    args: WithdrawAndSwitchMethodType,
  ) => PopulatedTransaction;
}

export class WithdrawAndSwitchAdapterService
  extends BaseService<ParaSwapWithdrawSwapAdapter>
  implements WithdrawSwitchAdapterInterface
{
  readonly withdrawAndSwitchAdapterAddress: string;
  readonly contractInterface: ParaSwapWithdrawSwapAdapterInterface;

  constructor(
    provider: providers.Provider,
    withdrawSwitchAdapterAddress?: string,
  ) {
    super(provider, ParaSwapWithdrawSwapAdapter__factory);

    this.withdrawAndSwitchAdapterAddress = withdrawSwitchAdapterAddress ?? '';

    this.contractInterface =
      ParaSwapWithdrawSwapAdapter__factory.createInterface();

    this.withdrawAndSwitch = this.withdrawAndSwitch.bind(this);
  }

  @WithdrawAndSwitchValidator
  public withdrawAndSwitch(
    @isEthAddress('user')
    @isEthAddress('assetToSwitchFrom')
    @isEthAddress('assetToSwitchTo')
    @isEthAddress('augustus')
    @isPositiveAmount('amountToSwitch')
    @isPositiveAmount('minAmountToReceive')
    {
      user,
      assetToSwitchFrom,
      assetToSwitchTo,
      amountToSwitch,
      minAmountToReceive,
      permitParams,
      augustus,
      switchCallData,
      switchAll,
    }: WithdrawAndSwitchMethodType,
  ): PopulatedTransaction {
    const actionTx: PopulatedTransaction = {};

    const txData = this.contractInterface.encodeFunctionData(
      'withdrawAndSwap',
      [
        assetToSwitchFrom,
        assetToSwitchTo,
        amountToSwitch,
        minAmountToReceive,
        switchAll
          ? augustusFromAmountOffsetFromCalldata(switchCallData as string)
          : 0,
        switchCallData,
        augustus,
        permitParams,
      ],
    );

    actionTx.to = this.withdrawAndSwitchAdapterAddress;
    actionTx.data = txData;
    actionTx.from = user;

    return actionTx;
  }
}
