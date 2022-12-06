import { BigNumber, providers, constants, ethers } from 'ethers';
import { IPool } from '../../v3-pool-contract/typechain/IPool';
import { IPool__factory } from '../../v3-pool-contract/typechain/IPool__factory';
import { GhoService, IGhoService } from '../GhoService';
import { GhoDiscountRateStrategy } from '../typechain/GhoDiscountRateStrategy';
import { GhoDiscountRateStrategy__factory } from '../typechain/GhoDiscountRateStrategy__factory';
import { GhoToken } from '../typechain/GhoToken';
import { GhoToken__factory } from '../typechain/GhoToken__factory';
import { GhoVariableDebtToken } from '../typechain/GhoVariableDebtToken';
import { GhoVariableDebtToken__factory } from '../typechain/GhoVariableDebtToken__factory';

const ghoDataMock = {
  baseVariableBorrowRate: '0',
  ghoDiscountedPerToken: '0',
  ghoDiscountRate: '0',
  ghoDiscountLockPeriod: '0',
  facilitatorBucketLevel: '0',
  facilitatorBucketMaxCapacity: '0',
  ghoMinDebtTokenBalanceForDiscount: '0',
  ghoMinDiscountTokenBalanceForDiscount: '0',
  userGhoDiscountRate: '0',
  userDiscountTokenBalance: '0',
};

describe('GhoService', () => {
  const ghoTokenAddress = constants.AddressZero;
  const poolAddress = constants.AddressZero;
  const user = constants.AddressZero;
  const provider: providers.Provider = new providers.JsonRpcProvider();

  describe('Init', () => {
    it('Expects to create the instance', () => {
      const instance: IGhoService = new GhoService({
        provider,
        ghoTokenAddress,
        poolAddress,
      });

      expect(instance instanceof GhoService);
    });
  });
  describe('getGhoData full mock', () => {
    const instance: IGhoService = new GhoService({
      provider,
      ghoTokenAddress,
      poolAddress,
    });
    jest
      .spyOn(instance, 'getGhoData')
      .mockImplementation(async () => Promise.resolve(ghoDataMock));
    it('Expects to get GhoData response type', async () => {
      const rawData = await instance.getGhoData();
      expect(rawData).toEqual(ghoDataMock);
    });

    it('Expects to get GhoData response type without passing user address', async () => {
      const rawData = await instance.getGhoData(user);
      expect(rawData).toEqual(ghoDataMock);
    });
  });

  describe('getGhoData mock individual calls', () => {
    const instance: IGhoService = new GhoService({
      provider,
      ghoTokenAddress,
      poolAddress,
    });

    const zeroBN = BigNumber.from({
      _hex: '0x00',
      _isBigNumber: true,
    });

    // mock Pool.getReserveData
    jest.spyOn(IPool__factory, 'connect').mockReturnValue({
      getReserveData: async () =>
        Promise.resolve({
          currentVariableBorrowRate: zeroBN,
          variableDebtTokenAddress: constants.AddressZero,
        }),
    } as unknown as IPool);

    // mock GhoVariableDebtToken functions
    jest.spyOn(GhoVariableDebtToken__factory, 'connect').mockReturnValue({
      getDiscountRateStrategy: async () =>
        Promise.resolve(constants.AddressZero),
      getDiscountLockPeriod: async () => Promise.resolve(zeroBN),
      getDiscountToken: async () => Promise.resolve(constants.AddressZero),
      getUserDiscountPercent: async () => Promise.resolve(zeroBN),
      getDiscountPercent: async () => Promise.resolve(zeroBN),
    } as unknown as GhoVariableDebtToken);

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
    const mockBucket = [zeroBN, zeroBN];

    // Mock it
    jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
      getFacilitatorBucket: async () => Promise.resolve(mockBucket),
    } as unknown as GhoToken);

    it('Expects to get GhoData response type', async () => {
      const rawData = await instance.getGhoData();
      expect(rawData).toEqual(ghoDataMock);
    });

    it('Expects to get GhoData response type without passing user address', async () => {
      const rawData = await instance.getGhoData(user);
      expect(rawData).toEqual(ghoDataMock);
    });
  });
});
