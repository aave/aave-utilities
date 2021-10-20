import { BigNumber, constants, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  // GasType,
  transactionType,
} from '../commons/types';
import { DEFAULT_NULL_VALUE_ON_TX } from '../commons/utils';
import { IncentivesController } from '../index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
    getGasPrice: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('IncentiveController', () => {
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();
  describe('Create new IncentvieController', () => {
    it('Expects to be initialized correctly', () => {
      const context = {
        chainId: 1,
        injectedProvider: correctProvider,
      };
      const incentivesInstance = new IncentivesController(context);
      expect(incentivesInstance instanceof IncentivesController);
    });
  });
  describe('claimRewards', () => {
    const context = {
      chainId: 1,
      injectedProvider: correctProvider,
    };
    const incentivesInstance = new IncentivesController(context);
    const user = '0x0000000000000000000000000000000000000001';
    const assets = [
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ];
    const to = '0x0000000000000000000000000000000000000004';
    const incentivesControllerAddress =
      '0x0000000000000000000000000000000000000005';

    it('Expects to get claimReward tx object with correct params', async () => {
      const claimRewardsTxObject: EthereumTransactionTypeExtended[] =
        incentivesInstance.claimRewards({
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
        ['address[]', 'uint256', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(to);

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
        ['address[]', 'uint256', 'address'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0].length).toEqual(2);
      expect(decoded[0]).toEqual(assets);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(user);

      // gas price
      const gasPrice = await claimRewardsTxObject[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to not get claimReward tx with wrong params: user', async () => {
      const user = 'asdf';
      try {
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        });
      } catch (error: unknown) {
        expect(error).toEqual(
          new Error(`Address: ${user} is not a valid ethereum Address`),
        );
      }
    });
    it('Expects to not get claimReward tx with wrong params: incentivesControllerAddress', async () => {
      const incentivesControllerAddress = 'asdf';
      try {
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        });
      } catch (error: unknown) {
        expect(error).toEqual(
          new Error(
            `Address: ${incentivesControllerAddress} is not a valid ethereum Address`,
          ),
        );
      }
    });

    it('Expects to not get claimReward tx with wrong params: to', async () => {
      const to = 'asdf';
      try {
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        });
      } catch (error: unknown) {
        expect(error).toEqual(
          new Error(`Address: ${to} is not a valid ethereum Address`),
        );
      }
    });

    it('Expects to not get claimReward tx with wrong params: assets', async () => {
      const assets = ['asdfasdf', '0x0000000000000000000000000000000000000003'];
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(
        new Error(`Address: ${assets[0]} is not a valid ethereum Address`),
      );
    });
    it('Expects to not get claimReward tx with wrong params: empty assets', async () => {
      const assets: string[] = [];
      expect(() =>
        incentivesInstance.claimRewards({
          user,
          assets,
          to,
          incentivesControllerAddress,
        }),
      ).toThrowError(new Error(`Addresses Array should not be empty`));
    });
  });
});
