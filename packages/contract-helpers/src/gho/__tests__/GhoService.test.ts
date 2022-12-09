import { BigNumber, providers, constants, ethers } from 'ethers';
// import { IPool } from '../../v3-pool-contract/typechain/IPool';
// import { IPool__factory } from '../../v3-pool-contract/typechain/IPool__factory';
import { GhoService, IGhoService } from '../GhoService';
// import { GhoDiscountRateStrategy } from '../typechain/GhoDiscountRateStrategy';
// import { GhoDiscountRateStrategy__factory } from '../typechain/GhoDiscountRateStrategy__factory';
// import { GhoToken } from '../typechain/GhoToken';
// import { GhoToken__factory } from '../typechain/GhoToken__factory';
import { GhoVariableDebtToken } from '../typechain/GhoVariableDebtToken';
import { GhoVariableDebtToken__factory } from '../typechain/GhoVariableDebtToken__factory';
import { GhoReserveData, GhoUserData } from '../types';

const ghoReserveDataMock: GhoReserveData = {
  ghoBaseVariableBorrowRate: '0',
  ghoDiscountedPerToken: '0',
  ghoDiscountRate: '0',
  ghoDiscountLockPeriod: '0',
  aaveFacilitatorBucketLevel: '0',
  aaveFacilitatorBucketMaxCapacity: '0',
  ghoMinDebtTokenBalanceForDiscount: '0',
  ghoMinDiscountTokenBalanceForDiscount: '0',
  ghoCurrentBorrowIndex: '0',
  ghoReserveLastUpdateTimestamp: '0',
};

const ghoUserDataMock: GhoUserData = {
  userGhoDiscountRate: '0',
  userDiscountTokenBalance: '0',
  userGhoScaledBorrowBalance: '0',
  userPreviousGhoBorrowIndex: '0',
  userDiscountLockPeriodEndTimestamp: '0',
};

describe('GhoService', () => {
  const ghoTokenAddress = constants.AddressZero;
  const ghoVariableDebtTokenAddress = constants.AddressZero;
  const ghoATokenAddress = constants.AddressZero;
  const poolAddress = constants.AddressZero;
  const provider: providers.Provider = new providers.JsonRpcProvider();

  describe('Init', () => {
    it('Expects to create the instance', () => {
      const instance: IGhoService = new GhoService({
        provider,
        ghoATokenAddress,
        ghoTokenAddress,
        ghoVariableDebtTokenAddress,
        poolAddress,
      });

      expect(instance instanceof GhoService);
    });
  });

  describe('getGhoReserveData full mock', () => {
    const instance: IGhoService = new GhoService({
      provider,
      ghoATokenAddress,
      ghoTokenAddress,
      ghoVariableDebtTokenAddress,
      poolAddress,
    });
    jest
      .spyOn(instance, 'getGhoReserveData')
      .mockImplementation(async () => Promise.resolve(ghoReserveDataMock));
    it('Expects to get GhoReserveData response type', async () => {
      const rawData = await instance.getGhoReserveData();
      expect(rawData).toEqual(ghoReserveDataMock);
    });
  });

  /* describe('getGhoReserveData mock individual calls', () => {
    const instance: IGhoService = new GhoService({
      provider,
      ghoTokenAddress,
      ghoVariableDebtTokenAddress,
      ghoATokenAddress,
      poolAddress,
    });

    const zeroBN = BigNumber.from({
      _hex: '0x00',
      _isBigNumber: true,
    });

    // mock GhoVariableDebtToken functions
    jest.spyOn(GhoVariableDebtToken__factory, 'connect').mockReturnValue({
      getDiscountLockPeriod: async () => Promise.resolve(zeroBN),
      getDiscountRateStrategy: async () =>
        Promise.resolve(constants.AddressZero),
      getDiscountPercent: async () => Promise.resolve(zeroBN),
    } as unknown as GhoVariableDebtToken);

    // mock Pool.getReserveData
    jest.spyOn(IPool__factory, 'connect').mockReturnValue({
      getReserveData: async () =>
        Promise.resolve({
          currentVariableBorrowRate: zeroBN,
          variableDebtTokenAddress: constants.AddressZero,
          variableBorrowIndex: zeroBN,
        }),
    } as unknown as IPool);

    // mock GhoDiscountRateStrategy functions
    jest.spyOn(GhoDiscountRateStrategy__factory, 'connect').mockReturnValue({
      GHO_DISCOUNTED_PER_DISCOUNT_TOKEN: async () => Promise.resolve(zeroBN),
      DISCOUNT_RATE: async () => Promise.resolve(zeroBN),
      MIN_DISCOUNT_TOKEN_BALANCE: async () => Promise.resolve(zeroBN),
      MIN_DEBT_TOKEN_BALANCE: async () => Promise.resolve(zeroBN),
      calculateDiscountRate: async () => Promise.resolve(zeroBN),
    } as unknown as GhoDiscountRateStrategy);

    // @ts-expect-error not overriding all Contract functions as only balanceOf is used
    jest.spyOn(ethers, 'Contract').mockReturnValue({
      balanceOf: async (_userAddress: string) => Promise.resolve(zeroBN),
    });

    // mock GhoToken facilitator bucket info
    const mockBucket = { level: zeroBN, maxCapacity: zeroBN };

    // Mock it
    jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
      getFacilitatorBucket: async () => Promise.resolve(mockBucket),
    } as unknown as GhoToken);

    it('Expects to get GhoData response type', async () => {
      const rawData = await instance.getGhoReserveData();
      expect(rawData).toEqual(ghoReserveDataMock);
    });
  }); */

  describe('getGhoUserData full mock', () => {
    const instance: IGhoService = new GhoService({
      provider,
      ghoATokenAddress,
      ghoTokenAddress,
      ghoVariableDebtTokenAddress,
      poolAddress,
    });
    const mockAddress = constants.AddressZero;
    jest
      .spyOn(instance, 'getGhoUserData')
      .mockImplementation(async () => Promise.resolve(ghoUserDataMock));
    it('Expects to get GhoUserData response type', async () => {
      const rawData = await instance.getGhoUserData(mockAddress);
      expect(rawData).toEqual(ghoUserDataMock);
    });
    it('Expects to get GhoUserData response type with disountToken parameter passed', async () => {
      const rawData = await instance.getGhoUserData(mockAddress, mockAddress);
      expect(rawData).toEqual(ghoUserDataMock);
    });
  });

  describe('getGhoUserData mock individual calls', () => {
    const zeroBN = BigNumber.from({
      _hex: '0x00',
      _isBigNumber: true,
    });

    // mock GhoVariableDebtToken functions
    jest.spyOn(GhoVariableDebtToken__factory, 'connect').mockReturnValue({
      getDiscountToken: async () => Promise.resolve(constants.AddressZero),
      getDiscountPercent: async (_userAddress: string) =>
        Promise.resolve(zeroBN),
      getUserRebalanceTimestamp: async (_userAddress: string) =>
        Promise.resolve(zeroBN),
      scaledBalanceOf: async (_userAddress: string) => Promise.resolve(zeroBN),
      getPreviousIndex: async (_userAdddress: string) =>
        Promise.resolve(zeroBN),
    } as unknown as GhoVariableDebtToken);

    // @ts-expect-error not overriding all Contract functions as only balanceOf is used
    jest.spyOn(ethers, 'Contract').mockReturnValue({
      balanceOf: async (_userAddress: string) => Promise.resolve(zeroBN),
    });

    const mockAddress = constants.AddressZero;

    const instance: IGhoService = new GhoService({
      provider,
      ghoATokenAddress,
      ghoTokenAddress,
      ghoVariableDebtTokenAddress,
      poolAddress,
    });
    it('Expects to get GhoUserData response type', async () => {
      const rawData = await instance.getGhoUserData(mockAddress);
      expect(rawData).toEqual(ghoUserDataMock);
    });

    it('Expects to get GhoUserData response type with discount token parameter', async () => {
      const rawData = await instance.getGhoUserData(mockAddress, mockAddress);
      expect(rawData).toEqual(ghoUserDataMock);
    });
  });
});
