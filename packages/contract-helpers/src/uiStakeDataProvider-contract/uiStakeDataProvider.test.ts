import { BigNumber, providers } from 'ethers';
import {
  GeneralStakeUIDataHumanized,
  GeneralStakeUIDataRaw,
  GetUserStakeTotalsRaw,
  GetUserStakeUIDataHumanized,
  GetUserStakeUIDataRaw,
} from './_mocks';
import { StakedTokenDataProvider } from './typechain/StakedTokenDataProvider';
import { StakedTokenDataProvider__factory } from './typechain/StakedTokenDataProviderFactory';
import { UiStakeDataProvider, UiStakeDataProviderInterface } from './index';

describe('UiStakeDataProvider', () => {
  const user = '0x0000000000000000000000000000000000000001';
  const uiStakeDataProvider = '0x0000000000000000000000000000000000000002';
  const dataProvider: providers.Provider = new providers.JsonRpcProvider();

  jest.spyOn(StakedTokenDataProvider__factory, 'connect').mockReturnValue({
    getGeneralStakeUIData: async () => Promise.resolve(GeneralStakeUIDataRaw),
    getUserStakeUIData: async () => Promise.resolve(GetUserStakeUIDataRaw),
    getGeneralStakeUIDataHumanized: async () =>
      Promise.resolve(GeneralStakeUIDataHumanized),
    getUserStakeUIDataHumanized: async () =>
      Promise.resolve(GetUserStakeUIDataHumanized),
    getAllStakedTokenData: async () => Promise.resolve(GeneralStakeUIDataRaw),
    getAllStakedTokenUserData: async () =>
      Promise.resolve(GetUserStakeTotalsRaw),
  } as unknown as StakedTokenDataProvider);

  describe('Init', () => {
    it('Expects to create the instance', () => {
      const instance: UiStakeDataProviderInterface = new UiStakeDataProvider({
        uiStakeDataProvider,
        provider: dataProvider,
      });

      expect(instance instanceof UiStakeDataProvider);
    });
  });
  describe('getUserStakeUIData', () => {
    const instance: UiStakeDataProviderInterface = new UiStakeDataProvider({
      uiStakeDataProvider,
      provider: dataProvider,
    });
    it('Expects to get user raw data', async () => {
      const rawData = await instance.getUserStakeUIData({ user });
      expect(rawData.stkAaveData.stakedTokenUserBalance).toEqual(
        BigNumber.from(0),
      );
    });
    it('Expects to fail if user not eth address', async () => {
      const user = 'asdf';
      await expect(async () =>
        instance.getUserStakeUIData({ user }),
      ).rejects.toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
  });
  describe('getGeneralStakeUIData', () => {
    const instance: UiStakeDataProviderInterface = new UiStakeDataProvider({
      uiStakeDataProvider,
      provider: dataProvider,
    });
    it('Expects to get general stake raw data', async () => {
      const rawData = await instance.getGeneralStakeUIData();
      expect(rawData).toEqual(GeneralStakeUIDataRaw);
    });
  });
  describe('getUserStakeUIDataHumanized', () => {
    const instance: UiStakeDataProviderInterface = new UiStakeDataProvider({
      uiStakeDataProvider,
      provider: dataProvider,
    });
    it('Expects to get user data in a humanized format', async () => {
      const rawData = await instance.getUserStakeUIDataHumanized({ user });
      expect(rawData).toEqual(GetUserStakeUIDataHumanized);
    });
    it('Expects to fail if user not eth address', async () => {
      const user = 'asdf';
      await expect(async () =>
        instance.getUserStakeUIDataHumanized({ user }),
      ).rejects.toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
  });
  describe('getGeneralStakeUIDataHumanized', () => {
    const instance: UiStakeDataProviderInterface = new UiStakeDataProvider({
      uiStakeDataProvider,
      provider: dataProvider,
    });
    it('Expects to get general stake data in a humanized format', async () => {
      const rawData = await instance.getGeneralStakeUIDataHumanized();
      expect(rawData).toEqual(GeneralStakeUIDataHumanized);
    });
  });
});
