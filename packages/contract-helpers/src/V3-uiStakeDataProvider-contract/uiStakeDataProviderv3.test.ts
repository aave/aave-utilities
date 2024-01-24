import { providers } from 'ethers';
import {
  GeneralStakeUIDataHumanized,
  // GeneralStakeUIDataRaw,
  // GetUserStakeTotalsRaw,
  GetUserStakeUIDataHumanized,
  stakedUserDataRaw,
  mockStakedData,
  // GetUserStakeUIDataRaw,
} from './_mocks';
// import { Abi as IStakedTokenDataProvider, Abi__factory } from './typechain';

import { Abi as IStakedTokenDataProvider } from './typechain/Abi';
import { Abi__factory } from './typechain/factories/Abi__factory';

import { UiStakeDataProviderV3, UiStakeDataProviderInterfaceV3 } from './index';

describe('UiStakeDataProviderV3', () => {
  const user = '0x0000000000000000000000000000000000000001';
  const uiStakeDataProviderV3 = '0x0000000000000000000000000000000000000002';
  const asset = '0x0000000000000000000000000000000000000003';
  const oracle = '0x0000000000000000000000000000000000000004';

  const dataProvider: providers.Provider = new providers.JsonRpcProvider();

  jest.spyOn(Abi__factory, 'connect').mockReturnValue({
    getStakedUserDataBatch: async () => Promise.resolve(stakedUserDataRaw),
    getStakedAssetDataBatch: async () => Promise.resolve(mockStakedData),
  } as unknown as IStakedTokenDataProvider);

  describe('Init', () => {
    it('Expects to create the instance', () => {
      const instance: UiStakeDataProviderInterfaceV3 =
        new UiStakeDataProviderV3({
          uiStakeDataProvider: uiStakeDataProviderV3,
          provider: dataProvider,
        });

      expect(instance instanceof UiStakeDataProviderV3);
    });
  });

  describe('getGeneralStakeUIData', () => {
    const instance: UiStakeDataProviderInterfaceV3 = new UiStakeDataProviderV3({
      uiStakeDataProvider: uiStakeDataProviderV3,
      provider: dataProvider,
    });
    it('Expects to get general stake raw data', async () => {
      const rawData = await instance.getStakedAssetDataBatch([asset], [oracle]);
      expect(rawData).toEqual(GeneralStakeUIDataHumanized);
    });
  });
  describe('getUserStakeUIDataHumanized', () => {
    const instance: UiStakeDataProviderInterfaceV3 = new UiStakeDataProviderV3({
      uiStakeDataProvider: uiStakeDataProviderV3,
      provider: dataProvider,
    });
    it('Expects to get user data in a humanized format', async () => {
      const rawData = await instance.getUserStakeUIDataHumanized({
        user,
        stakedAssets: [asset],
        oracles: [oracle],
      });

      expect(rawData).toEqual(GetUserStakeUIDataHumanized);
    });
  });
});
