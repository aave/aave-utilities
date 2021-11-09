import { BigNumber, constants, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  // EthereumTransactionTypeExtended,
  GasType,
  InterestRate,
  ProtocolAction,
  // InterestRate,
  // ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  DEFAULT_NULL_VALUE_ON_TX,
  gasLimitRecommendations,
  // gasLimitRecommendations,
  // SURPLUS,
  valueToWei,
} from '../commons/utils';
import { Pool } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('Pool', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const POOL = '0x0000000000000000000000000000000000000001';
  const WETH_GATEWAY = '0x0000000000000000000000000000000000000002';
  const FLASH_LIQUIDATION_ADAPTER =
    '0x0000000000000000000000000000000000000003';
  const REPAY_WITH_COLLATERAL_ADAPTER =
    '0x0000000000000000000000000000000000000004';
  const SWAP_COLLATERAL_ADAPTER = '0x0000000000000000000000000000000000000005';
  describe('Initialization', () => {
    const config = {
      POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new Pool(provider, config);
      expect(instance instanceof Pool).toEqual(true);
    });
    it('Expects ot initialize correctly without passing configuration', () => {
      const instance = new Pool(provider);
      expect(instance instanceof Pool).toEqual(true);
    });
  });
  describe('deposit', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const amount = '123.456';
    const decimals = 18;
    const referralCode = '1';

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all parameters with eth deposit', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);
      const depositEthSpy = jest
        .spyOn(poolInstance.wethGatewayService, 'depositETH')
        .mockReturnValue([]);
      await poolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(depositEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters without approval need', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(1);
      const txObj = depositTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.deposit({
        user,
        reserve,
        amount,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(1);
      const txObj = depositTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(user);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters but not referral', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(1);
      const txObj = depositTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters and needing approval', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(2);
      const txObj = depositTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('300000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when passing all params and depositing Synthetix but amount not valid', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError('Not enough funds to execute operation');

      expect(synthetixSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('supply', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const amount = '123.456';
    const decimals = 18;
    const referralCode = '1';

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all parameters with eth supply', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);
      const supplyEthSpy = jest
        .spyOn(poolInstance.wethGatewayService, 'depositETH')
        .mockReturnValue([]);
      await poolInstance.supply({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(supplyEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters without approval need', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supply({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supply({
        user,
        reserve,
        amount,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(user);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters but not referral', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supply({
        user,
        reserve,
        amount,
        onBehalfOf,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters and needing approval', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supply({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.length).toEqual(2);
      const txObj = supplyTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('300000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when passing all params and supplying Synthetix but amount not valid', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.supply({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError('Not enough funds to execute operation');

      expect(synthetixSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.supply({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.supply({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.supply({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.supply({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.supply({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('SignSupply', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const amount = '123.456';
    const decimals = 18;
    jest.spyOn(provider, 'getTransactionCount').mockResolvedValue(1);
    jest.spyOn(provider, 'getNetwork').mockResolvedValue({
      name: 'mainnet',
      chainId: 1,
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const config = { POOL };
    it('Expects the permission string to be returned when all params', async () => {
      const poolInstance = new Pool(provider, config);

      jest.spyOn(poolInstance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      const signature: string = await poolInstance.signSupply({
        user,
        reserve,
        amount,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { primaryType, domain, message } = await JSON.parse(signature);
      expect(primaryType).toEqual('Permit');
      expect(domain.name).toEqual('mockToken');
      expect(domain.chainId).toEqual(1);

      expect(message.owner).toEqual(user);
      expect(message.spender).toEqual(POOL);
      expect(message.value).toEqual(valueToWei(amount, decimals));
      expect(message.nonce).toEqual(1);
      expect(message.deadline).toEqual(constants.MaxUint256.toString());
    });
    it('Expects to fail when not initialized with POOL', async () => {
      const poolInstance = new Pool(provider, { POOL: 'asdf' });
      const signature: string = await poolInstance.signSupply({
        user,
        reserve,
        amount,
      });
      expect(signature).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const user = 'asdf';
      await expect(async () =>
        poolInstance.signSupply({ user, reserve, amount }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.signSupply({ user, reserve, amount }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = '0';
      await expect(async () =>
        poolInstance.signSupply({ user, reserve, amount }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = 'asdf';
      await expect(async () =>
        poolInstance.signSupply({ user, reserve, amount }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('supplyWithPermit', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const referralCode = 1;
    // const message = 'victor washington'
    const signature =
      '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';

    const amount = '123.456';
    const decimals = 18;

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object if all params ok,', async () => {
      const poolInstance = new Pool(provider, { POOL });
      jest.spyOn(poolInstance.erc20Service, 'decimalsOf').mockResolvedValue(18);

      const supplyTxObj = await poolInstance.supplyWithPermit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        signature,
      });

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'uint256',
          'address',
          'uint16',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(referralCode);
      expect(decoded[4]).toEqual(constants.MaxUint256);
      expect(decoded[5]).toEqual(28);
      expect(decoded[6]).toEqual(
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e',
      );
      expect(decoded[7]).toEqual(
        '0x47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object if all params ok, without onBehalf', async () => {
      const poolInstance = new Pool(provider, { POOL });
      jest.spyOn(poolInstance.erc20Service, 'decimalsOf').mockResolvedValue(18);

      const supplyTxObj = await poolInstance.supplyWithPermit({
        user,
        reserve,
        amount,
        // onBehalfOf,
        referralCode,
        signature,
      });

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'uint256',
          'address',
          'uint16',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(user);
      expect(decoded[3]).toEqual(referralCode);
      expect(decoded[4]).toEqual(constants.MaxUint256);
      expect(decoded[5]).toEqual(28);
      expect(decoded[6]).toEqual(
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e',
      );
      expect(decoded[7]).toEqual(
        '0x47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object if all params ok, without referralCode', async () => {
      const poolInstance = new Pool(provider, { POOL });
      jest.spyOn(poolInstance.erc20Service, 'decimalsOf').mockResolvedValue(18);

      const supplyTxObj = await poolInstance.supplyWithPermit({
        user,
        reserve,
        amount,
        onBehalfOf,
        // referralCode,
        signature,
      });

      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'uint256',
          'address',
          'uint16',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(0);
      expect(decoded[4]).toEqual(constants.MaxUint256);
      expect(decoded[5]).toEqual(28);
      expect(decoded[6]).toEqual(
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e',
      );
      expect(decoded[7]).toEqual(
        '0x47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when sythetix is not validated', async () => {
      const poolInstance = new Pool(provider, { POOL });
      jest.spyOn(poolInstance.erc20Service, 'decimalsOf').mockResolvedValue(18);

      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError('Not enough funds to execute operation');

      expect(synthetixSpy).toHaveBeenCalled();
    });
    it('Expects to fail if POOL not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL: 'asdf' });
      const txObj = await poolInstance.supplyWithPermit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        signature,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail if user not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const user = 'asdf';
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if reserve not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if onBehalfOf not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if amount not positive', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = '0';
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail if amount not number', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = 'asdf';
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail if referralCode not positive', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const referralCode = -1;
      await expect(async () =>
        poolInstance.supplyWithPermit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
          signature,
        }),
      ).rejects.toThrowError(
        `Amount: ${referralCode} needs to be greater than 0`,
      );
    });
  });
  describe('withdraw', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const aTokenAddress = '0x0000000000000000000000000000000000000009';
    const amount = '123.456';
    const decimals = 18;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the tx object passing all parameters for eth withdraw', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);
      const withdrawEthSpy = jest
        .spyOn(poolInstance.wethGatewayService, 'withdrawETH')
        .mockReturnValue(Promise.resolve([]));
      await poolInstance.withdraw({
        user,
        reserve,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
      expect(withdrawEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const depositTxObj = await poolInstance.withdraw({
        user,
        reserve,
        amount,
        aTokenAddress,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(1);
      const txObj = depositTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.withdraw].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(user);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.withdraw].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and -1 amount', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const amount = '-1';
      const depositTxObj = await poolInstance.withdraw({
        user,
        reserve,
        amount,
        onBehalfOf,
        aTokenAddress,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.length).toEqual(1);
      const txObj = depositTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.withdraw].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(onBehalfOf);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.withdraw].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail for eth withdraw if not aTokenAddress is passed', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);

      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
        }),
      ).rejects.toThrowError(
        'To withdraw ETH you need to pass the aWETH token address',
      );
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.withdraw({
        user,
        reserve,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when aTokenAddress not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const aTokenAddress = 'asdf';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${aTokenAddress} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('borrow', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const debtTokenAddress = '0x0000000000000000000000000000000000000009';
    const amount = '123.456';
    const decimals = 18;
    const referralCode = '1';
    const interestRateMode = InterestRate.None;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all parameters with borrow eth', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);
      const borrowEthSpy = jest
        .spyOn(poolInstance.wethGatewayService, 'borrowETH')
        .mockReturnValue(Promise.resolve([]));
      await poolInstance.borrow({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        onBehalfOf,
        referralCode,
      });
      expect(borrowEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters but not onBehalfOf and rate none', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const borrowTxObj = await poolInstance.borrow({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        referralCode,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(borrowTxObj.length).toEqual(1);
      const txObj = borrowTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(Number(referralCode));
      expect(decoded[4]).toEqual(user);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters but not referralCode and rate stable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const interestRateMode = InterestRate.Stable;
      const borrowTxObj = await poolInstance.borrow({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        onBehalfOf,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(borrowTxObj.length).toEqual(1);
      const txObj = borrowTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(0);
      expect(decoded[4]).toEqual(onBehalfOf);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all parameters with Interest rate Variable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const interestRateMode = InterestRate.Variable;
      const borrowTxObj = await poolInstance.borrow({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        onBehalfOf,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(borrowTxObj.length).toEqual(1);
      const txObj = borrowTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(2));
      expect(decoded[3]).toEqual(0);
      expect(decoded[4]).toEqual(onBehalfOf);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when borrowing eth and not passing debtTokenAddress', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);

      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
      );
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);

      const txs = await poolInstance.borrow({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        onBehalfOf,
        referralCode,
      });
      expect(txs).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when debtTokenAddress not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const debtTokenAddress = 'asdf';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${debtTokenAddress} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asfd';
      await expect(async () =>
        poolInstance.borrow({
          user,
          reserve,
          amount,
          interestRateMode,
          debtTokenAddress,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
});
