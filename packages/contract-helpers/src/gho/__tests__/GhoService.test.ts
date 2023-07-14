import { providers, constants } from 'ethers';
import { GhoService, IGhoService } from '../GhoService';
import { IUiGhoDataProvider } from '../typechain/IUiGhoDataProvider';
import { IUiGhoDataProvider__factory } from '../typechain/IUiGhoDataProvider__factory';
import { GhoReserveData, GhoUserData } from '../types';

const ghoReserveDataMock: GhoReserveData = {
  ghoBaseVariableBorrowRate: '0',
  ghoDiscountedPerToken: '0',
  ghoDiscountRate: '0',
  aaveFacilitatorBucketLevel: '0',
  aaveFacilitatorBucketMaxCapacity: '0',
  ghoMinDebtTokenBalanceForDiscount: '0',
  ghoMinDiscountTokenBalanceForDiscount: '0',
  ghoCurrentBorrowIndex: '0',
  ghoReserveLastUpdateTimestamp: '0',
};

const ghoUserDataMock: GhoUserData = {
  userGhoDiscountPercent: '0',
  userDiscountTokenBalance: '0',
  userGhoScaledBorrowBalance: '0',
  userPreviousGhoBorrowIndex: '0',
};

describe('GhoService', () => {
  const uiGhoDataProviderAddress = constants.AddressZero;
  const provider: providers.Provider = new providers.JsonRpcProvider();

  describe('Init', () => {
    it('Expects to create the instance', () => {
      const instance: IGhoService = new GhoService({
        provider,
        uiGhoDataProviderAddress,
      });
      expect(instance instanceof GhoService);
    });

    it('Expects to throw an error with an invalid parameter address', () => {
      expect(
        () =>
          new GhoService({
            provider,
            uiGhoDataProviderAddress: 'hi',
          }),
      ).toThrowError('UiGhoDataProvider contract address is not valid');
    });

    describe('getGhoReserveData full mock', () => {
      it('Expects to get GhoReserveData response type', async () => {
        // Mock it
        const spy = jest
          .spyOn(IUiGhoDataProvider__factory, 'connect')
          .mockReturnValue({
            getGhoReserveData: async () => Promise.resolve(ghoReserveDataMock),
          } as unknown as IUiGhoDataProvider);

        // Call it
        const instance: IGhoService = new GhoService({
          provider,
          uiGhoDataProviderAddress,
        });
        const rawReserveData = await instance.getGhoReserveData();

        // Assert it
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(1);
        expect(rawReserveData).toEqual(ghoReserveDataMock);
      });
    });

    describe('getGhoUserData full mock', () => {
      it('Expects to get GhoUserData response type', async () => {
        // Mock it
        const spy = jest
          .spyOn(IUiGhoDataProvider__factory, 'connect')
          .mockReturnValue({
            getGhoUserData: async (_userAddress: string) =>
              Promise.resolve(ghoUserDataMock),
          } as unknown as IUiGhoDataProvider);

        // Call it
        const instance: IGhoService = new GhoService({
          provider,
          uiGhoDataProviderAddress,
        });
        const mockAddress = constants.AddressZero;
        const rawUserData = await instance.getGhoUserData(mockAddress);

        // Assert it
        expect(spy).toHaveBeenCalled();
        expect(spy).toBeCalledTimes(2); // reserve + user
        expect(rawUserData).toEqual(ghoUserDataMock);
      });

      it('Expects to throw an error with an invalid user address', async () => {
        const instance: IGhoService = new GhoService({
          provider,
          uiGhoDataProviderAddress,
        });
        await expect(instance.getGhoUserData('hello')).rejects.toThrow(
          'user address is not valid',
        );
      });
    });
  });
});
