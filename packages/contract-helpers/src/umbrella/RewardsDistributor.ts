import { BigNumber, PopulatedTransaction } from 'ethers';
import { ProtocolAction } from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { IRewardsDistributorInterface } from './typechain/IRewardsDistributor';
import { IRewardsDistributor__factory } from './typechain/IRewardsDistributor__factory';

interface RewardsDistributorClaimAllRewardsParams {
  stakeToken: string;
  sender: string;
}

interface RewardsDistributorClaimSelectedRewardsParams {
  stakeToken: string;
  rewards: string[];
  sender: string;
}

export class RewardsDistributorService {
  private readonly interface: IRewardsDistributorInterface;

  constructor(private readonly rewardsDistributorAddress: string) {
    this.interface = IRewardsDistributor__factory.createInterface();
  }

  claimAllRewards({
    stakeToken,
    sender,
  }: RewardsDistributorClaimAllRewardsParams) {
    const tx: PopulatedTransaction = {};
    const receiver = sender;
    const txData = this.interface.encodeFunctionData('claimAllRewards', [
      stakeToken,
      receiver,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.rewardsDistributorAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaClaimAllRewards]
        .recommended,
    );
    return tx;
  }

  claimSelectedRewards({
    stakeToken,
    rewards,
    sender,
  }: RewardsDistributorClaimSelectedRewardsParams) {
    const tx: PopulatedTransaction = {};
    const receiver = sender;
    const txData = this.interface.encodeFunctionData('claimSelectedRewards', [
      stakeToken,
      rewards,
      receiver,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.rewardsDistributorAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaClaimSelectedRewards]
        .recommended,
    );
    return tx;
  }
}
