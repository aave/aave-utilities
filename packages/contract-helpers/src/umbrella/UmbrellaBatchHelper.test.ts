import { BigNumber, Wallet } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { ProtocolAction } from '../commons/types';
import {
  DEFAULT_MOCK_VERIFYING_CONTRACT,
  expectToBeDefined,
  gasLimitRecommendations,
  generateEIP712PermitMock,
  makePair,
} from '../commons/utils';
import { IUmbrellaBatchHelper } from './typechain/UmbrellaBatchHelper';
import { UmbrellaBatchHelper__factory } from './typechain/UmbrellaBatchHelper__factory';
import { UmbrellaBatchHelperService } from './';

describe('UmbrellaBatchHelper', () => {
  const { address: STAKE_TOKEN } = makePair('STAKE_TOKEN');
  const { address: ALICE, privateKey: ALICE_PRIVATE_KEY } = makePair('ALICE');
  const aliceWallet = new Wallet(ALICE_PRIVATE_KEY);
  const batchHelperService = new UmbrellaBatchHelperService(STAKE_TOKEN);
  const batchHelperInterface = UmbrellaBatchHelper__factory.createInterface();
  describe('deposit', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = batchHelperService.deposit({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        amount,
        edgeToken: DEFAULT_MOCK_VERIFYING_CONTRACT,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expectToBeDefined(tx.gasLimit);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
          .recommended,
      );
      const decoded = batchHelperInterface.decodeFunctionData(
        'deposit',
        tx.data,
      ) as [IUmbrellaBatchHelper.IODataStruct];
      expect(decoded).toHaveLength(1);
      const struct = decoded[0];
      expect(struct.edgeToken).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(struct.stakeToken).toEqual(STAKE_TOKEN);
      expect(BigNumber.from(struct.value).toString()).toEqual(amount);
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
      const tx = batchHelperService.depositWithPermit({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        edgeToken: DEFAULT_MOCK_VERIFYING_CONTRACT,
        amount,
        deadline,
        permit: signature,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayStakeWithPermit
        ].recommended,
      );
      const decoded = batchHelperInterface.decodeFunctionData(
        'multicall',
        tx.data,
      ) as [string, string];
      expect(decoded).toHaveLength(1);
      const tx1 = decoded[0][0];
      const tx1Decoded = batchHelperInterface.decodeFunctionData(
        'permit',
        tx1,
      ) as [IUmbrellaBatchHelper.PermitStruct];
      expect(tx1Decoded).toHaveLength(1);
      const permitStruct = tx1Decoded[0];
      expect(permitStruct.token).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(BigNumber.from(permitStruct.value).toString()).toEqual(amount);
      expect(BigNumber.from(permitStruct.deadline).toString()).toEqual(
        deadline,
      );
      const splittedSignature = splitSignature(signature);
      expect(permitStruct.v).toEqual(splittedSignature.v);
      expect(permitStruct.r).toEqual(splittedSignature.r);
      expect(permitStruct.s).toEqual(splittedSignature.s);
      const tx2 = decoded[0][1];
      const tx2Decoded = batchHelperInterface.decodeFunctionData(
        'deposit',
        tx2,
      ) as [IUmbrellaBatchHelper.IODataStruct];
      expect(tx2Decoded).toHaveLength(1);
      const struct = tx2Decoded[0];
      expect(struct.edgeToken).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(struct.stakeToken).toEqual(STAKE_TOKEN);
      expect(BigNumber.from(struct.value).toString()).toEqual(amount);
    });
  });
  describe('redeem', () => {
    it('should properly create the transaction', () => {
      const amount = '1337';
      const tx = batchHelperService.redeem({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        edgeToken: DEFAULT_MOCK_VERIFYING_CONTRACT,
        amount,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
          .recommended,
      );
      const decoded = batchHelperInterface.decodeFunctionData(
        'redeem',
        tx.data,
      ) as [IUmbrellaBatchHelper.IODataStruct];
      expect(decoded).toHaveLength(1);
      const struct = decoded[0];
      expect(struct.edgeToken).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(struct.stakeToken).toEqual(STAKE_TOKEN);
      expect(BigNumber.from(struct.value).toString()).toEqual(amount);
    });
  });
  describe('redeemWithPermit', () => {
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
      const tx = batchHelperService.redeemWithPermit({
        sender: ALICE,
        stakeToken: STAKE_TOKEN,
        edgeToken: DEFAULT_MOCK_VERIFYING_CONTRACT,
        amount,
        deadline,
        permit: signature,
      });
      expect(tx.from).toEqual(ALICE);
      expect(tx.to).toEqual(STAKE_TOKEN);
      expect(tx.gasLimit.toString()).toEqual(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayStakeWithPermit
        ].recommended,
      );
      const decoded = batchHelperInterface.decodeFunctionData(
        'multicall',
        tx.data,
      ) as [string, string];
      expect(decoded).toHaveLength(1);
      const tx1 = decoded[0][0];
      const tx1Decoded = batchHelperInterface.decodeFunctionData(
        'permit',
        tx1,
      ) as [IUmbrellaBatchHelper.PermitStruct];
      expect(tx1Decoded).toHaveLength(1);
      const permitStruct = tx1Decoded[0];
      expect(permitStruct.token).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(BigNumber.from(permitStruct.value).toString()).toEqual(amount);
      expect(BigNumber.from(permitStruct.deadline).toString()).toEqual(
        deadline,
      );
      const splittedSignature = splitSignature(signature);
      expect(permitStruct.v).toEqual(splittedSignature.v);
      expect(permitStruct.r).toEqual(splittedSignature.r);
      expect(permitStruct.s).toEqual(splittedSignature.s);
      const tx2 = decoded[0][1];
      const tx2Decoded = batchHelperInterface.decodeFunctionData(
        'redeem',
        tx2,
      ) as [IUmbrellaBatchHelper.IODataStruct];
      expect(tx2Decoded).toHaveLength(1);
      const struct = tx2Decoded[0];
      expect(struct.edgeToken).toEqual(DEFAULT_MOCK_VERIFYING_CONTRACT);
      expect(struct.stakeToken).toEqual(STAKE_TOKEN);
      expect(BigNumber.from(struct.value).toString()).toEqual(amount);
    });
  });
});
