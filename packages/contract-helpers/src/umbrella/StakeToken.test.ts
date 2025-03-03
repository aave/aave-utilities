import { BigNumber, Wallet } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { ProtocolAction } from '../commons/types';
import {
  expectToBeDefined,
  gasLimitRecommendations,
  generateEIP712PermitMock,
  makePair,
} from '../commons/utils';
import { IERC4626StakeToken } from './typechain/StakeToken';
import { IERC4626StakeToken__factory } from './typechain/StakeToken__factory';
import { StakeTokenService } from './';

describe('Umbrella Stake Token', () => {
  const { address: STAKE_TOKEN } = makePair('STAKE_TOKEN');
  const { address: ALICE, privateKey: ALICE_PRIVATE_KEY } = makePair('ALICE');
  const aliceWallet = new Wallet(ALICE_PRIVATE_KEY);
  const stakeTokenService = new StakeTokenService(STAKE_TOKEN);
  const stakeTokenInterface = IERC4626StakeToken__factory.createInterface();

  describe('cooldown', () => {
    it('should properly create the transaction', () => {
      const tx = stakeTokenService.cooldown({ sender: ALICE });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenCooldown]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'cooldown',
        tx.data,
      );
      expect(decoded).toHaveLength(0);
    });
  });
  describe('deposit', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeTokenService.deposit({
        amount,
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenDeposit]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'deposit',
        tx.data,
      ) as [BigNumber, string];
      expect(decoded).toHaveLength(2);
      expect(decoded[0].toString()).toEqual(amount);
      expect(decoded[1]).toEqual(ALICE);
    });
  });
  describe('depositWithPermit', () => {
    it('should properly create the transaction', async () => {
      const amount = '1337';
      const deadline = '1';
      const { domain, types, value } = generateEIP712PermitMock(
        ALICE,
        STAKE_TOKEN,
        amount,
        deadline,
      );
      const signature = await aliceWallet._signTypedData(domain, types, value);
      const tx = stakeTokenService.depositWithPermit({
        amount,
        deadline,
        permit: signature,
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeTokenDepositWithPermit
        ].recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'depositWithPermit',
        tx.data,
      ) as [
        BigNumber,
        string,
        BigNumber,
        IERC4626StakeToken.SignatureParamsStruct,
      ];
      expect(decoded).toHaveLength(4);
      expect(decoded[0].toString()).toEqual(amount);
      expect(decoded[1]).toEqual(ALICE);
      expect(decoded[2].toString()).toEqual(deadline);
      const splittedSignature = splitSignature(signature);
      expect(decoded[3]).toMatchObject({
        v: splittedSignature.v,
        r: splittedSignature.r,
        s: splittedSignature.s,
      });
    });
  });
  describe('redeem', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeTokenService.redeem({
        amount,
        sender: ALICE,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenRedeem]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'redeem',
        tx.data,
      ) as [BigNumber, string, string];
      expect(decoded).toHaveLength(3);
      expect(decoded[0].toString()).toEqual(amount);
      expect(decoded[1]).toEqual(ALICE);
      expect(decoded[2]).toEqual(ALICE);
    });
  });
});
