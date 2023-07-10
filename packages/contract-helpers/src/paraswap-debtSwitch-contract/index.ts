import {
  BigNumberish,
  BytesLike,
  PopulatedTransaction,
  providers,
  utils,
} from 'ethers';
import BaseService from '../commons/BaseService';
import { augustusToAmountOffsetFromCalldata } from '../commons/utils';
import {
  ParaSwapDebtSwapAdapter,
  ParaSwapDebtSwapAdapterInterface,
} from './typechain/ParaSwapDebtSwitchAdapter';
import { ParaSwapDebtSwapAdapter__factory } from './typechain/ParaSwapDebtSwitchAdapter__factory';

export type DebtSwitchType = {
  user: string;
  debtAssetUnderlying: string;
  debtRepayAmount: string;
  debtRateMode: number;
  newAssetDebtToken: string;
  newAssetUnderlying: string;
  maxNewDebtAmount: string;
  repayAll: boolean;
  txCalldata: string;
  augustus: string;
  deadline: BigNumberish;
  signedAmount: string;
  sigV: BigNumberish;
  sigR: BytesLike;
  sigS: BytesLike;
};

export interface ParaswapDebtSwitchInterface {
  debtSwitch: (args: DebtSwitchType) => PopulatedTransaction;
}

export class DebtSwitchAdapterService
  extends BaseService<ParaSwapDebtSwapAdapter>
  implements ParaswapDebtSwitchInterface
{
  readonly debtSwitchAddress: string;
  readonly contractInterface: ParaSwapDebtSwapAdapterInterface;

  constructor(provider: providers.Provider, debtSwitchAddress?: string) {
    super(provider, ParaSwapDebtSwapAdapter__factory);

    this.debtSwitchAddress = debtSwitchAddress ?? '';

    this.contractInterface = ParaSwapDebtSwapAdapter__factory.createInterface();

    this.debtSwitch = this.debtSwitch.bind(this);
  }

  public debtSwitch({
    user,
    debtAssetUnderlying,
    debtRepayAmount,
    debtRateMode,
    newAssetDebtToken,
    newAssetUnderlying,
    maxNewDebtAmount,
    repayAll,
    txCalldata,
    augustus,
    deadline,
    sigV,
    sigR,
    sigS,
    signedAmount,
  }: DebtSwitchType): PopulatedTransaction {
    const callDataEncoded = utils.defaultAbiCoder.encode(
      ['bytes', 'address'],
      [txCalldata, augustus],
    );

    const txParamsStruct: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct = {
      debtAsset: debtAssetUnderlying,
      debtRepayAmount,
      debtRateMode,
      newDebtAsset: newAssetUnderlying,
      maxNewDebtAmount,
      offset: repayAll ? augustusToAmountOffsetFromCalldata(txCalldata) : 0,
      paraswapData: callDataEncoded,
    };

    const creditDelParamsStruct: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct =
      {
        debtToken: newAssetDebtToken,
        value: signedAmount,
        deadline,
        v: sigV,
        r: sigR,
        s: sigS,
      };

    const actionTx: PopulatedTransaction = {};

    const txData = this.contractInterface.encodeFunctionData('swapDebt', [
      txParamsStruct,
      creditDelParamsStruct,
    ]);

    actionTx.to = this.debtSwitchAddress;
    actionTx.data = txData;
    actionTx.from = user;

    return actionTx;
  }
}
