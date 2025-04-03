import { ProtocolAction } from '../commons/types';
import {
  expectToBeDefined,
  gasLimitRecommendations,
  makePair,
} from '../commons/utils';
import { IRewardsDistributor__factory } from './typechain/IRewardsDistributor__factory';
import { RewardsDistributorService } from './';

describe('Umbrella Rewards distributor', () => {
  const { address: STAKE_TOKEN } = makePair('STAKE_TOKEN');
  const { address: STAKE_TOKEN_2 } = makePair('STAKE_TOKEN_2');
  const { address: ALICE } = makePair('ALICE');

  const REWARD_1 = makePair('REWARD_1').address;
  const REWARD_2 = makePair('REWARD_2').address;

  const stakeTokenService = new RewardsDistributorService(STAKE_TOKEN);
  const stakeTokenInterface = IRewardsDistributor__factory.createInterface();
  describe('claimAllAvailableRewards', () => {
    it('should properly create the transaction', () => {
      const tx = stakeTokenService.claimAllAvailableRewards({
        stakeTokens: [STAKE_TOKEN, STAKE_TOKEN_2],
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expectToBeDefined(tx.data);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaClaimAllRewards]
          .recommended,
      );
      const decoded = stakeTokenInterface.decodeFunctionData(
        'claimAllRewards(address[],address)',
        tx.data,
      );
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual([STAKE_TOKEN, STAKE_TOKEN_2]);
      expect(decoded[1]).toEqual(ALICE);
    });
  });
  describe('claimAllRewards', () => {
    it('should properly create the transaction', () => {
      const tx = stakeTokenService.claimAllRewards({
        stakeToken: STAKE_TOKEN,
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expectToBeDefined(tx.data);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaClaimAllRewards]
          .recommended,
      );
      const decoded = stakeTokenInterface.decodeFunctionData(
        'claimAllRewards(address,address)',
        tx.data,
      );
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1]).toEqual(ALICE);
    });
  });
  describe('claimSelectedRewards', () => {
    it('should properly create the transaction', () => {
      const rewards = [REWARD_1, REWARD_2];
      const tx = stakeTokenService.claimSelectedRewards({
        stakeToken: STAKE_TOKEN,
        rewards,
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expectToBeDefined(tx.data);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaClaimSelectedRewards]
          .recommended,
      );
      const decoded = stakeTokenInterface.decodeFunctionData(
        'claimSelectedRewards(address,address[],address)',
        tx.data,
      );
      expect(decoded).toHaveLength(3);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1]).toEqual(rewards);
      expect(decoded[2]).toEqual(ALICE);
    });
  });
});
