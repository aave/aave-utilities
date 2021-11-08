import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  PermitSignature,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { RepayWithCollateralValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { IRepayWithCollateral } from './typechain/IRepayWithCollateral';
import { IRepayWithCollateral__factory } from './typechain/IRepayWithCollateral__factory';

export type RepayWithCollateralType = {
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

export class RepayWithCollateralAdapterService
  extends BaseService<IRepayWithCollateral>
  implements RepayWithCollateralAdapterInterface
{
  readonly repayWithCollateralAddress: string;

  constructor(
    provider: providers.Provider,
    repayWithCollateralAddress?: string,
  ) {
    super(provider, IRepayWithCollateral__factory);

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
  ): EthereumTransactionTypeExtended {
    const numericInterestRate = debtRateMode === InterestRate.Stable ? 1 : 2;

    const repayWithCollateralContract: IRepayWithCollateral =
      this.getContractInstance(this.repayWithCollateralAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        repayWithCollateralContract.populateTransaction.swapAndRepay(
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          numericInterestRate,
          permit,
          useEthPath ?? false,
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
