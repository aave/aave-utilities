import { BigNumber, providers } from 'ethers';
import { InterestRate } from '../commons/types';
import { API_ETH_MOCK_ADDRESS } from '../commons/utils';
import { LendingPoolBundle } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('LendingPoolBundle', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const LENDING_POOL = '0x0000000000000000000000000000000000000001';
  const WETH_GATEWAY = '0x0000000000000000000000000000000000000002';
  const USER = '0x0000000000000000000000000000000000000003';
  const TOKEN = '0x0000000000000000000000000000000000000004';
  describe('Initialization', () => {
    const config = {
      LENDING_POOL,
      WETH_GATEWAY,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new LendingPoolBundle(provider, config);
      expect(instance instanceof LendingPoolBundle).toEqual(true);
    });
    it('Expects to initialize correctly without passing configuration', () => {
      const instance = new LendingPoolBundle(provider);
      expect(instance instanceof LendingPoolBundle).toEqual(true);
    });
  });

  describe('SupplyTxBuilder', () => {
    const config = {
      LENDING_POOL,
      WETH_GATEWAY,
    };

    const instance = new LendingPoolBundle(provider, config);

    it('gets approved amount for Pool', async () => {
      jest
        .spyOn(instance.erc20Service, 'approvedAmount')
        .mockReturnValue(Promise.resolve(1));

      const result = await instance.depositTxBuilder.getApprovedAmount({
        user: USER,
        token: TOKEN,
      });
      expect(result.amount).toEqual('1');
      expect(result.spender).toEqual(LENDING_POOL);
      expect(result.token).toEqual(TOKEN);
      expect(result.user).toEqual(USER);
    });

    it('gets approved amount for WETHGateway', async () => {
      jest
        .spyOn(instance.erc20Service, 'approvedAmount')
        .mockReturnValue(Promise.resolve(1));

      const result = await instance.depositTxBuilder.getApprovedAmount({
        user: USER,
        token: API_ETH_MOCK_ADDRESS,
      });
      expect(result.amount).toEqual('1');
      expect(result.spender).toEqual(WETH_GATEWAY);
      expect(result.token).toEqual(API_ETH_MOCK_ADDRESS);
      expect(result.user).toEqual(USER);
    });

    it('generates deposit tx data with generateTxData', () => {
      const result = instance.depositTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
      });

      const differentParamsSameResult =
        instance.depositTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
          referralCode: '0',
        });

      const differentParamsSameResult2 =
        instance.depositTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
          onBehalfOf: USER,
        });

      const differentParamsSameResult3 =
        instance.depositTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
        });

      expect(result.to).toEqual(LENDING_POOL);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(
        '0xe8eda9df0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(differentParamsSameResult.data).toEqual(
        '0xe8eda9df0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(differentParamsSameResult2.data).toEqual(
        '0xe8eda9df0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(differentParamsSameResult3.data).toEqual(
        '0xe8eda9df0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000',
      );
    });

    it('generates deposit tx for WETHGateway data with generateTxData', () => {
      const result = instance.depositTxBuilder.generateTxData({
        user: USER,
        reserve: API_ETH_MOCK_ADDRESS.toLowerCase(),
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
      });
      expect(result.to).toEqual(WETH_GATEWAY);
      expect(result.from).toEqual(USER);
      expect(result.value).toEqual(BigNumber.from('1'));
      expect(result.data).toEqual(
        '0x474cf53d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('BorrowTxBuilder', () => {
    const config = {
      LENDING_POOL,
      WETH_GATEWAY,
    };

    const instance = new LendingPoolBundle(provider, config);

    it('generates borrow tx data with generateTxData', () => {
      const stableResult = instance.borrowTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
        interestRateMode: InterestRate.Stable,
      });

      const result = instance.borrowTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
        interestRateMode: InterestRate.Variable,
      });

      const differentParamsSameResult = instance.borrowTxBuilder.generateTxData(
        {
          user: USER,
          reserve: TOKEN,
          amount: '1',
          referralCode: '0',
          interestRateMode: InterestRate.Variable,
        },
      );

      const differentParamsSameResult2 =
        instance.borrowTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
          onBehalfOf: USER,
          interestRateMode: InterestRate.Variable,
        });

      const differentParamsSameResult3 =
        instance.borrowTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
          interestRateMode: InterestRate.Variable,
        });
      const variableBorrowTxData =
        '0xa415bcad00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003';
      const stableBorrowTxData =
        '0xa415bcad00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003';
      expect(result.to).toEqual(LENDING_POOL);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(variableBorrowTxData);
      expect(differentParamsSameResult.data).toEqual(variableBorrowTxData);
      expect(differentParamsSameResult2.data).toEqual(variableBorrowTxData);
      expect(differentParamsSameResult3.data).toEqual(variableBorrowTxData);
      expect(stableResult.data).toEqual(stableBorrowTxData);
    });

    it('generates deposit tx for WETHGateway data with generateTxData', async () => {
      const result = instance.borrowTxBuilder.generateTxData({
        user: USER,
        reserve: API_ETH_MOCK_ADDRESS.toLowerCase(),
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
        interestRateMode: InterestRate.Variable,
        debtTokenAddress: API_ETH_MOCK_ADDRESS.toLowerCase(),
      });
      expect(result.to).toEqual(WETH_GATEWAY);
      expect(result.from).toEqual(USER);
      expect(result.value).toEqual(undefined);
      expect(result.data).toEqual(
        '0x66514c970000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000',
      );

      await expect(async () =>
        instance.borrowTxBuilder.generateTxData({
          user: USER,
          reserve: API_ETH_MOCK_ADDRESS.toLowerCase(),
          amount: '1',
          onBehalfOf: USER,
          interestRateMode: InterestRate.Variable,
          referralCode: '0',
        }),
      ).rejects.toThrowError(
        `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
      );
    });
  });

  describe('RepayTxBuilder', () => {
    const config = {
      LENDING_POOL,
      WETH_GATEWAY,
    };

    const instance = new LendingPoolBundle(provider, config);

    it('generates repay tx data with generateTxData with variable debt', () => {
      const result = instance.repayTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        interestRateMode: InterestRate.Variable,
      });

      const differentParamsSameResult = instance.repayTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        interestRateMode: InterestRate.Variable,
      });

      expect(result.to).toEqual(LENDING_POOL);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(
        '0x573ade810000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
      );
      expect(differentParamsSameResult.data).toEqual(
        '0x573ade810000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
      );
    });

    it('generates repay tx data with generateTxData with stable debt', () => {
      const result = instance.repayTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        interestRateMode: InterestRate.Stable,
      });

      expect(result.to).toEqual(LENDING_POOL);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(
        '0x573ade810000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003',
      );
    });

    it('generates repay tx for WETHGateway data with generateTxData with variable debt', () => {
      const result = instance.repayTxBuilder.generateTxData({
        user: USER,
        reserve: API_ETH_MOCK_ADDRESS.toLowerCase(),
        amount: '1',
        onBehalfOf: USER,
        interestRateMode: InterestRate.Variable,
      });
      expect(result.to).toEqual(WETH_GATEWAY);
      expect(result.from).toEqual(USER);
      expect(result.value).toEqual(BigNumber.from('1'));
      expect(result.data).toEqual(
        '0x02c5fcf80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
      );
    });

    it('generates repay tx data with generateTxData with variable debt and max repay', () => {
      const result = instance.repayTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '-1',
        onBehalfOf: USER,
        interestRateMode: InterestRate.Variable,
      });

      expect(result.to).toEqual(LENDING_POOL);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(
        '0x573ade810000000000000000000000000000000000000000000000000000000000000004ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
      );
    });
  });
});
