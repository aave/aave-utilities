import { BigNumber, providers } from 'ethers';
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

      const result = await instance.supplyTxBuilder.getApprovedAmount({
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

      const result = await instance.supplyTxBuilder.getApprovedAmount({
        user: USER,
        token: API_ETH_MOCK_ADDRESS,
      });
      expect(result.amount).toEqual('1');
      expect(result.spender).toEqual(WETH_GATEWAY);
      expect(result.token).toEqual(API_ETH_MOCK_ADDRESS);
      expect(result.user).toEqual(USER);
    });

    it('generates approval with generateApprovalTxData', () => {
      const result = instance.supplyTxBuilder.generateApprovalTxData({
        user: USER,
        token: TOKEN,
        spender: LENDING_POOL,
        amount: '1',
      });

      expect(result).toBeDefined();
      expect(result.to).toEqual(TOKEN);
      expect(result.from).toEqual(USER);
      expect(result.data).toEqual(
        '0x095ea7b300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
      );
    });

    it('generates deposit tx data with generateTxData', () => {
      const result = instance.supplyTxBuilder.generateTxData({
        user: USER,
        reserve: TOKEN,
        amount: '1',
        onBehalfOf: USER,
        referralCode: '0',
      });

      const differentParamsSameResult = instance.supplyTxBuilder.generateTxData(
        {
          user: USER,
          reserve: TOKEN,
          amount: '1',
          referralCode: '0',
        },
      );

      const differentParamsSameResult2 =
        instance.supplyTxBuilder.generateTxData({
          user: USER,
          reserve: TOKEN,
          amount: '1',
          onBehalfOf: USER,
        });

      const differentParamsSameResult3 =
        instance.supplyTxBuilder.generateTxData({
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
      const result = instance.supplyTxBuilder.generateTxData({
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
});
