import { BigNumber, constants, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  // GasType,
  transactionType,
} from '../commons/types';
import { DEFAULT_NULL_VALUE_ON_TX } from '../commons/utils';
import { IncentivesControllerV2 } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('IncentiveController', () => {
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  describe('Create new IncentvieController', () => {
    it('Expects to be initialized correctly', () => {
      const incentivesInstance = new IncentivesControllerV2(correctProvider);
      expect(incentivesInstance instanceof IncentivesControllerV2);
    });
  });
  describe('claimRewards', () => {
    const incentivesInstance = new IncentivesControllerV2(correctProvider);
    const user = '0x0000000000000000000000000000000000000001';
    const assets = [
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ];
    const to = '0x0000000000000000000000000000000000000004';
    const incentivesControllerAddress =
      '0x0000000000000000000000000000000000000005';
    const reward = '0x0000000000000000000000000000000000000006';

    it('Expects to get claimReward tx object with correct params', async () => {
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'uint256', 'address', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(to);
      expect(decoded[3]).toEqual(reward);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to get claimReward tx object with correct params without assets', async () => {
      const assets: string[] = [];
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'uint256', 'address', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(0);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(to);
      expect(decoded[3]).toEqual(reward);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to get claimReward tx object with correct params, without to address', async () => {
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimRewards({
          user,
          assets,
          incentivesControllerAddress,
          reward,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'uint256', 'address', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(user);
      expect(decoded[3]).toEqual(reward);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to not get claimReward tx with wrong params: user', () => {
      const user = 'asdf';
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        }),
      ).toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to not get claimReward tx with wrong params: incentivesControllerAddress', () => {
      const incentivesControllerAddress = 'asdf';
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        }),
      ).toThrowError(
        new Error(
          `Address: ${incentivesControllerAddress} is not a valid ethereum Address`,
        ),
      );
    });

    it('Expects to not get claimReward tx with wrong params: to', () => {
      const to = 'asdf';
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        }),
      ).toThrowError(
        new Error(`Address: ${to} is not a valid ethereum Address`),
      );
    });
    it('Expects to not get claimReward tx with wrong params: reward', () => {
      const reward = 'asdf';
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        }),
      ).toThrowError(
        new Error(`Address: ${reward} is not a valid ethereum Address`),
      );
    });

    it('Expects to not get claimReward tx with wrong params: assets', () => {
      const assets = ['asdfasdf', '0x0000000000000000000000000000000000000003'];
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
          reward,
        }),
      ).toThrowError(
        new Error(`Address: ${assets[0]} is not a valid ethereum Address`),
      );
    });
  });
  describe('claimAllRewards', () => {
    const incentivesInstance = new IncentivesControllerV2(correctProvider);
    const user = '0x0000000000000000000000000000000000000001';
    const assets = [
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ];
    const to = '0x0000000000000000000000000000000000000004';
    const incentivesControllerAddress =
      '0x0000000000000000000000000000000000000005';

    it('Expects to get claimAllReward tx object with correct params', async () => {
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(to);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to get claimAllReward tx object with correct params without assets', async () => {
      const assets: string[] = [];
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(0);
      expect(decoded[1]).toEqual(to);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to get claimAllReward tx object with correct params, without to address', async () => {
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimAllRewards({
          user,
          assets,
          incentivesControllerAddress,
        });

      expect(claimRewardsTxObject.length).toEqual(1);
      expect(claimRewardsTxObject[0].txType).toEqual(
        eEthereumTxType.REWARD_ACTION,
      );

      const txObj: transactionType = await claimRewardsTxObject[0].tx();
      expect(txObj.to).toEqual(incentivesControllerAddress);
      expect(txObj.from).toEqual(user);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address[]', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(user);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to not get claimAllReward tx with wrong params: user', () => {
      const user = 'asdf';
      expect(() =>
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to not get claimAllReward tx with wrong params: incentivesControllerAddress', () => {
      const incentivesControllerAddress = 'asdf';
      expect(() =>
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(
        new Error(
          `Address: ${incentivesControllerAddress} is not a valid ethereum Address`,
        ),
      );
    });

    it('Expects to not get claimAllReward tx with wrong params: to', () => {
      const to = 'asdf';
      expect(() =>
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(
        new Error(`Address: ${to} is not a valid ethereum Address`),
      );
    });

    it('Expects to not get claimAllReward tx with wrong params: assets', () => {
      const assets = ['asdfasdf', '0x0000000000000000000000000000000000000003'];
      expect(() =>
        incentivesInstance.claimAllRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(
        new Error(`Address: ${assets[0]} is not a valid ethereum Address`),
      );
    });
  });
});
