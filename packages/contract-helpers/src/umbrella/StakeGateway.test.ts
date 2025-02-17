import { BigNumber, Wallet } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { ProtocolAction } from '../commons/types';
import {
  expectToBeDefined,
  gasLimitRecommendations,
  generateEIP712PermitMock,
  makePair,
} from '../commons/utils';
import { StakeGateway__factory } from './typechain/StakeGateway__factory';
import { StakeGatewayService } from './';

describe('StakeGateway', () => {
  const { address: STAKE_TOKEN } = makePair('STAKE_TOKEN');
  const { address: ALICE, privateKey: ALICE_PRIVATE_KEY } = makePair('ALICE');
  const aliceWallet = new Wallet(ALICE_PRIVATE_KEY);
  const stakeGatewayService = new StakeGatewayService(STAKE_TOKEN);
  const stakeTokenInterface = StakeGateway__factory.createInterface();
  describe('stake', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeGatewayService.stake({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'stake',
        tx.data,
      ) as [string, BigNumber];
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
    });
  });
  describe('stakeWithPermit', () => {
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
      const tx = stakeGatewayService.stakeWithPermit({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
        deadline,
        permit: signature,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayStakeWithPermit
        ].recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'stakeWithPermit',
        tx.data,
      ) as [string, BigNumber, string, number, string, string];
      expect(decoded).toHaveLength(6);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
      expect(decoded[2].toString()).toEqual(deadline);
      const splittedSignature = splitSignature(signature);
      expect(decoded[3]).toEqual(splittedSignature.v);
      expect(decoded[4]).toEqual(splittedSignature.r);
      expect(decoded[5]).toEqual(splittedSignature.s);
    });
  });
  describe('stakeATokens', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeGatewayService.stakeATokens({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStakeATokens]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'stakeATokens',
        tx.data,
      ) as [string, BigNumber];
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
    });
  });
  describe('stakeATokensWithPermit', () => {
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
      const tx = stakeGatewayService.stakeATokensWithPermit({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
        deadline,
        permit: signature,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayStakeATokensWithPermit
        ].recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'stakeATokensWithPermit',
        tx.data,
      ) as [string, BigNumber, string, number, string, string];
      expect(decoded).toHaveLength(6);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
      expect(decoded[2].toString()).toEqual(deadline);
      const splittedSignature = splitSignature(signature);
      expect(decoded[3]).toEqual(splittedSignature.v);
      expect(decoded[4]).toEqual(splittedSignature.r);
      expect(decoded[5]).toEqual(splittedSignature.s);
    });
  });
  describe('stakeNativeTokens', () => {
    it('should properly create the transaction', async () => {
      const amount = '1337';
      const tx = stakeGatewayService.stakeNativeTokens({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayStakeNativeTokens
        ].recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'stakeNativeTokens',
        tx.data,
      ) as [string];
      expect(decoded).toHaveLength(1);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.value);
      expect(tx.value.toString()).toEqual(amount);
    });
  });
  describe('redeem', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeGatewayService.redeem({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'redeem',
        tx.data,
      ) as [string, BigNumber];
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
    });
  });
  describe('redeemATokens', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeGatewayService.redeemATokens({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'redeemATokens',
        tx.data,
      ) as [string, BigNumber];
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
    });
  });
  describe('redeemNativeTokens', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = stakeGatewayService.redeemNativeTokens({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
          .recommended,
      );
      expectToBeDefined(tx.data);
      const decoded = stakeTokenInterface.decodeFunctionData(
        'redeemNativeTokens',
        tx.data,
      ) as [string, BigNumber];
      expect(decoded).toHaveLength(2);
      expect(decoded[0]).toEqual(STAKE_TOKEN);
      expect(decoded[1].toString()).toEqual(amount);
    });
  });
});
