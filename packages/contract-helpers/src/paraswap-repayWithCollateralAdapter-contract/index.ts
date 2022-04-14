import { BytesLike, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  PermitSignature,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { augustusToAmountOffsetFromCalldata } from '../commons/utils';
import { RepayWithCollateralValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ParaSwapRepayAdapter } from './typechain/ParaSwapRepayAdapter';
import { ParaSwapRepayAdapter__factory } from './typechain/ParaSwapRepayAdapter__factory';

export type SwapAndRepayType = {
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

export class ParaswapRepayWithCollateral
  extends BaseService<ParaSwapRepayAdapter>
  implements ParaswapRepayWithCollateralInterface
{
  readonly repayWithCollateralAddress: string;

  constructor(
    provider: providers.Provider,
    repayWithCollateralAddress?: string,
  ) {
    super(provider, ParaSwapRepayAdapter__factory);

    this.repayWithCollateralAddress = repayWithCollateralAddress ?? '';

    this.swapAndRepay = this.swapAndRepay.bind(this);
  }

  @RepayWithCollateralValidator
  public swapAndRepay(
    @isEthAddress('user')
    @isEthAddress('collateralAsset')
    @isEthAddress('debtAsset')
    @isPositiveAmount('collateralAmount')
    @isPositiveAmount('debtRepayAmount')
    @isEthAddress('augustus')
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
  ): EthereumTransactionTypeExtended {
    const numericInterestRate = debtRateMode === InterestRate.Stable ? 1 : 2;

    const swapAndRepayContract: ParaSwapRepayAdapter = this.getContractInstance(
      this.repayWithCollateralAddress,
    );
    const callDataEncoded = utils.defaultAbiCoder.encode(
      ['bytes', 'address'],
      [swapAndRepayCallData, augustus],
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        swapAndRepayContract.populateTransaction.swapAndRepay(
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          numericInterestRate,
          repayAll
            ? augustusToAmountOffsetFromCalldata(swapAndRepayCallData as string)
            : 0,
          callDataEncoded,
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
        ProtocolAction.repayCollateral,
      ),
    };
  }
}
