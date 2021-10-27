import { BigNumber, constants, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  transactionType,
} from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isEthAddressArray,
} from '../commons/validators/paramValidators';
import { IAaveIncentivesController } from './typechain/IAaveIncentivesController';
import { IAaveIncentivesController__factory } from './typechain/IAaveIncentivesController__factory';

export type ClaimRewardsMethodType = {
  user: string;
  assets: string[];
  to?: string;
  incentivesControllerAddress: string;
};

export interface IncentivesControllerInterface {
  claimRewards: (
    args: ClaimRewardsMethodType,
  ) => EthereumTransactionTypeExtended[];
}

export type AssetDataType = {
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
};
export class IncentivesController
  extends BaseService<IAaveIncentivesController>
  implements IncentivesControllerInterface
{
  constructor(provider: providers.Provider) {
    super(provider, IAaveIncentivesController__factory);
  }

  @IncentivesValidator
  public claimRewards(
    @isEthAddress('user')
    @isEthAddress('incentivesControllerAddress')
    @isEthAddress('to')
    @isEthAddressArray('assets')
    { user, assets, to, incentivesControllerAddress }: ClaimRewardsMethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: IAaveIncentivesController =
      this.getContractInstance(incentivesControllerAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        incentivesContract.populateTransaction.claimRewards(
          assets,
          constants.MaxUint256.toString(),
          to ?? user,
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

  @IncentivesValidator
  public async getAssetData(
    @isEthAddress() tokenAddress: string,
    @isEthAddress() incentivesControllerAddress: string,
  ): Promise<AssetDataType> {
    const incentivesContract: IAaveIncentivesController =
      this.getContractInstance(incentivesControllerAddress);
    return incentivesContract.getAssetData(tokenAddress);
  }

  @IncentivesValidator
  public async getDistributionEnd(
    @isEthAddress() incentivesControllerAddress: string,
  ): Promise<BigNumber> {
    const incentivesContract: IAaveIncentivesController =
      this.getContractInstance(incentivesControllerAddress);
    // eslint-disable-next-line new-cap
    return incentivesContract.DISTRIBUTION_END();
  }
}
