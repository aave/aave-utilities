import { constants } from 'ethers';
import BaseService from './BaseService';
import {
  Configuration,
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  IncentivesConfig,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IAaveIncentivesController } from './typechain/IAaveIncentivesController';
import { IAaveIncentivesController__factory } from './typechain/IAaveIncentivesController__factory';

export type ClaimRewardsMethodType = {
  user: string;
  assets: string[];
  to: string;
  incentivesControllerAddress: string;
};

export interface IncentivesControllerInterface {
  incentivesControllerRewardTokenAddress: tEthereumAddress;
  claimRewards: (
    args: ClaimRewardsMethodType,
  ) => EthereumTransactionTypeExtended[];
}

export type IncentivesConfigType = {
  INCENTIVES_CONTROLLER: string;
  INCENTIVES_CONTROLLER_REWARD_TOKEN: string;
};

export default class IncentivesController
  extends BaseService<IAaveIncentivesController>
  implements IncentivesControllerInterface
{
  public readonly incentivesControllerRewardTokenAddress: tEthereumAddress;
  readonly incentivesControllerAddress: string;

  readonly incentivesConfig: IncentivesConfig | undefined;

  constructor(config: Configuration) {
    super(config, IAaveIncentivesController__factory);
  }

  @IncentivesValidator
  public claimRewards(
    @isEthAddress('user')
    @isEthAddress('incentivesControllerAddress')
    @isEthAddress('to')
    { user, assets, to, incentivesControllerAddress }: ClaimRewardsMethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: IAaveIncentivesController =
      this.getContractInstance(this.incentivesControllerAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () =>
        incentivesContract.populateTransaction.claimRewards(
          assets,
          constants.MaxUint256.toString(),
          to || user,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.REWARD_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}
