import { BigNumber, constants, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
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
  SURPLUS,
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
  describe('signERC20Approval', () => {
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

      jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));

      jest
        .spyOn(poolInstance.erc20_2612Service, 'getNonce')
        .mockReturnValue(Promise.resolve(1));
      const signature: string = await poolInstance.signERC20Approval({
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
    it('Expects the permission string to be returned when all params and amount -1', async () => {
      const poolInstance = new Pool(provider, config);

      jest.spyOn(poolInstance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));

      jest
        .spyOn(poolInstance.erc20_2612Service, 'getNonce')
        .mockReturnValue(Promise.resolve(1));

      const amount = '-1';
      const signature: string = await poolInstance.signERC20Approval({
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
      expect(message.value).toEqual(constants.MaxUint256.toString());
      expect(message.nonce).toEqual(1);
      expect(message.deadline).toEqual(constants.MaxUint256.toString());
    });
    it('Expects the permission string to be `` when no nonce', async () => {
      const poolInstance = new Pool(provider, config);

      jest.spyOn(poolInstance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(poolInstance.erc20_2612Service, 'getNonce')
        .mockReturnValue(Promise.resolve(null));

      const signature: string = await poolInstance.signERC20Approval({
        user,
        reserve,
        amount,
      });

      expect(signature).toEqual('');
    });
    it('Expects the permission string to be `` when already approved', async () => {
      const poolInstance = new Pool(provider, config);

      jest.spyOn(poolInstance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(true));

      const signature: string = await poolInstance.signERC20Approval({
        user,
        reserve,
        amount,
      });

      expect(signature).toEqual('');
    });
    it('Expects to fail when not initialized with POOL', async () => {
      const poolInstance = new Pool(provider, { POOL: 'asdf' });
      const signature: string = await poolInstance.signERC20Approval({
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
        poolInstance.signERC20Approval({ user, reserve, amount }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not eth address', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.signERC20Approval({ user, reserve, amount }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = '0';
      await expect(async () =>
        poolInstance.signERC20Approval({ user, reserve, amount }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, { POOL });

      const amount = 'asdf';
      await expect(async () =>
        poolInstance.signERC20Approval({ user, reserve, amount }),
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
  describe('repay', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const amount = '123.456';
    const decimals = 18;
    const interestRateMode = InterestRate.None;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with repay eth', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);
      const repayEthSpy = jest
        .spyOn(poolInstance.wethGatewayService, 'repayETH')
        .mockReturnValue([]);
      await poolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });
      expect(repayEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all params without onBehalfOf and no approval', async () => {
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

      const depositTxObj = await poolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
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
        ['address', 'uint256', 'uint256', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(user);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with amount -1 with approve needed and reate stable', async () => {
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

      const amount = '-1';
      const interestRateMode = InterestRate.Stable;
      const reapyTxObj = await poolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });

      expect(synthetixSpy).not.toHaveBeenCalled();
      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(2);
      const txObj = reapyTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(onBehalfOf);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.repay].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with with specific amount and synthetix repayment with valid amount and rate variable', async () => {
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

      const interestRateMode = InterestRate.Variable;
      const reapyTxObj = await poolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(2);
      const txObj = reapyTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(2));
      expect(decoded[3]).toEqual(onBehalfOf);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.repay].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail passing all params with with specific amount and synthetix repayment but not valid amount', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError('Not enough funds to execute operation');

      expect(decimalsSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount 0', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('repayWithPermit', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const amount = '123.456';
    const decimals = 18;
    const interestRateMode = InterestRate.None;
    // const message = 'victor washington'
    const signature =
      '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params without onBehalfOf', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.repayWithPermit({
        user,
        reserve,
        amount,
        interestRateMode,
        signature,
      });

      expect(synthetixSpy).toHaveBeenCalled();
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
        [
          'address',
          'uint256',
          'uint256',
          'address',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(user);
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
    it('Expects the tx object passing all params with amount -1 and reate stable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const amount = '-1';
      const interestRateMode = InterestRate.Stable;
      const reapyTxObj = await poolInstance.repayWithPermit({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
        signature,
      });

      expect(synthetixSpy).not.toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(1);
      const txObj = reapyTxObj[0];
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
          'uint256',
          'address',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(onBehalfOf);
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
    it('Expects the tx object passing all params with with specific amount and synthetix repayment with valid amount and rate variable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const interestRateMode = InterestRate.Variable;
      const reapyTxObj = await poolInstance.repayWithPermit({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
        signature,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(1);
      const txObj = reapyTxObj[0];
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
          'uint256',
          'address',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(2));
      expect(decoded[3]).toEqual(onBehalfOf);
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
    it('Expects to fail passing all params with with specific amount and synthetix repayment but not valid amount', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError('Not enough funds to execute operation');

      expect(decimalsSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.repayWithPermit({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
        signature,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount 0', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.repayWithPermit({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
          signature,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('swapBorrowRateMode', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const interestRateMode = InterestRate.None;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with Inerest rate None', async () => {
      const poolInstance = new Pool(provider, config);

      const swapBorrowRateModeTxObj = poolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(1));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with Inerest rate Stable', async () => {
      const poolInstance = new Pool(provider, config);
      const interestRateMode = InterestRate.Stable;
      const swapBorrowRateModeTxObj = poolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(1));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with Inerest rate Variable', async () => {
      const poolInstance = new Pool(provider, config);
      const interestRateMode = InterestRate.Variable;
      const swapBorrowRateModeTxObj = poolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(2));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', () => {
      const poolInstance = new Pool(provider);
      const txObj = poolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      expect(() =>
        poolInstance.swapBorrowRateMode({
          user,
          reserve,
          interestRateMode,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when reserve not and eth address', () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      expect(() =>
        poolInstance.swapBorrowRateMode({
          user,
          reserve,
          interestRateMode,
        }),
      ).toThrowError(`Address: ${reserve} is not a valid ethereum Address`);
    });
  });
  describe('setUsageAsCollateral', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const usageAsCollateral = true;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with usage as collateral true', async () => {
      const poolInstance = new Pool(provider, config);

      const setUsageAsCollateralTxObj = poolInstance.setUsageAsCollateral({
        user,
        reserve,
        usageAsCollateral,
      });

      expect(setUsageAsCollateralTxObj.length).toEqual(1);
      const txObj = setUsageAsCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(usageAsCollateral);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with usage as collateral false', async () => {
      const poolInstance = new Pool(provider, config);

      const usageAsCollateral = false;
      const setUsageAsCollateralTxObj = poolInstance.setUsageAsCollateral({
        user,
        reserve,
        usageAsCollateral,
      });

      expect(setUsageAsCollateralTxObj.length).toEqual(1);
      const txObj = setUsageAsCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(usageAsCollateral);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', () => {
      const poolInstance = new Pool(provider);
      const txObj = poolInstance.setUsageAsCollateral({
        user,
        reserve,
        usageAsCollateral,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      expect(() =>
        poolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      expect(() =>
        poolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        }),
      ).toThrowError(`Address: ${reserve} is not a valid ethereum Address`);
    });
  });
  describe('liquidationCall', () => {
    const liquidator = '0x0000000000000000000000000000000000000006';
    const liquidatedUser = '0x0000000000000000000000000000000000000007';
    const debtReserve = '0x0000000000000000000000000000000000000008';
    const collateralReserve = '0x0000000000000000000000000000000000000009';
    const purchaseAmount = '123.456';
    const getAToken = true;
    const liquidateAll = true;
    const decimals = 18;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params and no approval needed', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const liquidationCallTxObj = await poolInstance.liquidationCall({
        liquidator,
        liquidatedUser,
        debtReserve,
        collateralReserve,
        purchaseAmount,
        getAToken,
        liquidateAll,
      });

      expect(isApprovedSpy).toHaveBeenCalled();

      expect(liquidationCallTxObj.length).toEqual(1);
      const txObj = liquidationCallTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(liquidator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralReserve);
      expect(decoded[1]).toEqual(debtReserve);
      expect(decoded[2]).toEqual(liquidatedUser);
      expect(decoded[3]).toEqual(constants.MaxUint256);
      expect(decoded[4]).toEqual(getAToken);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params but not passing getAToken and no approval needed', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const liquidationCallTxObj = await poolInstance.liquidationCall({
        liquidator,
        liquidatedUser,
        debtReserve,
        collateralReserve,
        purchaseAmount,
        liquidateAll,
      });

      expect(isApprovedSpy).toHaveBeenCalled();

      expect(liquidationCallTxObj.length).toEqual(1);
      const txObj = liquidationCallTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(liquidator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralReserve);
      expect(decoded[1]).toEqual(debtReserve);
      expect(decoded[2]).toEqual(liquidatedUser);
      expect(decoded[3]).toEqual(constants.MaxUint256);
      expect(decoded[4]).toEqual(false);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params but not passing liquidateAll with approval needed', async () => {
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

      const liquidationCallTxObj = await poolInstance.liquidationCall({
        liquidator,
        liquidatedUser,
        debtReserve,
        collateralReserve,
        purchaseAmount,
        getAToken,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(liquidationCallTxObj.length).toEqual(2);
      const txObj = liquidationCallTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(liquidator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralReserve);
      expect(decoded[1]).toEqual(debtReserve);
      expect(decoded[2]).toEqual(liquidatedUser);
      expect(decoded[3]).toEqual(
        BigNumber.from(valueToWei(purchaseAmount, decimals)),
      );
      expect(decoded[4]).toEqual(getAToken);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.liquidationCall].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.liquidationCall({
        liquidator,
        liquidatedUser,
        debtReserve,
        collateralReserve,
        purchaseAmount,
        getAToken,
        liquidateAll,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when liquidator not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const liquidator = 'asdf';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Address: ${liquidator} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when liquidatedUser not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const liquidatedUser = 'asdf';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Address: ${liquidatedUser} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when debtReserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const debtReserve = 'asdf';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Address: ${debtReserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when collateralReserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const collateralReserve = 'asdf';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Address: ${collateralReserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when purchaseAmount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const purchaseAmount = '0';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Amount: ${purchaseAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when purchaseAmount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const purchaseAmount = 'asdf';
      await expect(async () =>
        poolInstance.liquidationCall({
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          purchaseAmount,
          getAToken,
          liquidateAll,
        }),
      ).rejects.toThrowError(
        `Amount: ${purchaseAmount} needs to be greater than 0`,
      );
    });
  });
  describe('swapCollateral', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const fromAsset = '0x0000000000000000000000000000000000000007';
    const fromAToken = '0x0000000000000000000000000000000000000008';
    const toAsset = '0x0000000000000000000000000000000000000009';
    const onBehalfOf = '0x0000000000000000000000000000000000000010';
    const augustus = '0x0000000000000000000000000000000000000011';
    const fromAmount = '12.34';
    const minToAmount = '13.56';
    const permitSignature = {
      amount: '1',
      deadline: '1',
      v: 1,
      r: '0x0000000000000000000000000000000000000000000000000000000000000001',
      s: '0x0000000000000000000000000000000000000000000000000000000000000001',
    };
    const swapAll = true;
    const referralCode = '1';
    const swapCallData =
      '0xda8567c80000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001e483c86fa843f6c2000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000180000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee5700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000116446c67b6d00000000000000000000000000000000000000000000000000000000000000200000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001dfec636122d1008df00000000000000000000000000000000000000000000001e4c566f818d31d01300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000006161766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001120000000000000000000000000000000000000000000000000000000006177abb9ae2ba6c0362c11ec8f12233bf85851b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000015180000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae90000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000108e47a6846afd000000000000000000000000000000000000000000000000000000000000099433f80000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb93d1d355dba3f70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c558d406f7449cc936da0231093b069fcb8a42e3a2f0f78f0497515f8d795a29c3a57485920bb65c42c9f5884af63388d493b5cd0bcd2a6eed4fff7173982f4f800000000000000000000000000000000000000000000000000000000000011f80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000420000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000011abcf02276ffa00000000000000000000000000000000000000000000000000000000000082b007c000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001bc072f450f48f66263bd53e801840fbf545c7aa5aac969d568f87eb830b66f36907cba9fd12582a9a96f23d1396da6c94d46fa4bc0ab851972246cd117659949f0000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000386598f16ac87200000000000000000000000000000000000000000000000000046a1698a248c022a0000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb902d4eee4d7c128000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c41623d640c08c3543660e464261260aed59bfba57c22b00326533525bd011953350326cee2a506e6daf1d0d8780eca139ec48cab2280c6e0bf1a1efe72b0ad880000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff0000000000000000000000000000000000000000000000000000000000001d4c00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000a91c3e5350e240000000000000000000000000000000000000000000000000000d41a7b6e826d0000000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001b842ca8317744091cfd12b2d2e9de4c17618cf2e19d5f0eecb68e3691b078542307aae0aeff4ae756ca20d0ec1dff2ec0a6cfdc595dd3a43d6b8a76f630c4b2f9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const flash = true;
    const decimals = 18;

    const amountWithSurplus: string = (
      Number(fromAmount) +
      (Number(fromAmount) * Number(SURPLUS)) / 100
    ).toString();

    const config = { POOL, SWAP_COLLATERAL_ADAPTER };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params and approval needed for flash', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));
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
      const swapCollateralTxObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(swapCollateralTxObj.length).toEqual(2);
      const txObj = swapCollateralTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'bytes',
          'address',
          'tuple(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        [
          toAsset,
          valueToWei(minToAmount, decimals),
          100,
          swapCallData,
          augustus,
          [
            permitSignature.amount,
            permitSignature.deadline,
            permitSignature.v,
            permitSignature.r,
            permitSignature.s,
          ],
        ],
      );

      expect(decoded[0]).toEqual(SWAP_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([fromAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(amountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.swapCollateral].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params without onBehalf and no approval needed for flash', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const swapCollateralTxObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        // onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(swapCollateralTxObj.length).toEqual(1);
      const txObj = swapCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'bytes',
          'address',
          'tuple(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        [
          toAsset,
          valueToWei(minToAmount, decimals),
          100,
          swapCallData,
          augustus,
          [
            permitSignature.amount,
            permitSignature.deadline,
            permitSignature.v,
            permitSignature.r,
            permitSignature.s,
          ],
        ],
      );

      expect(decoded[0]).toEqual(SWAP_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([fromAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(amountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(user);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params without referralCode and no approval needed for flash', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const swapCollateralTxObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        onBehalfOf,
        // referralCode,
        augustus,
        swapCallData,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(swapCollateralTxObj.length).toEqual(1);
      const txObj = swapCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'bytes',
          'address',
          'tuple(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        [
          toAsset,
          valueToWei(minToAmount, decimals),
          100,
          swapCallData,
          augustus,
          [
            permitSignature.amount,
            permitSignature.deadline,
            permitSignature.v,
            permitSignature.r,
            permitSignature.s,
          ],
        ],
      );

      expect(decoded[0]).toEqual(SWAP_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([fromAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(amountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed with flash and no swapAll', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const swapAll = false;
      const swapCollateralTxObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(swapCollateralTxObj.length).toEqual(1);
      const txObj = swapCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'bytes',
          'address',
          'tuple(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        [
          toAsset,
          valueToWei(minToAmount, decimals),
          0,
          swapCallData,
          augustus,
          [
            permitSignature.amount,
            permitSignature.deadline,
            permitSignature.v,
            permitSignature.r,
            permitSignature.s,
          ],
        ],
      );

      expect(decoded[0]).toEqual(SWAP_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([fromAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(fromAmount, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params without permitSignature and no approval needed without flash', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const swapAndDepositSpy = jest
        .spyOn(poolInstance.liquiditySwapAdapterService, 'swapAndDeposit')
        .mockReturnValue({} as EthereumTransactionTypeExtended);

      await poolInstance.swapCollateral({
        user,
        // flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        // permitSignature,
        swapAll,
        onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(swapAndDepositSpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when SWAP_COLLATERAL_ADAPTER not provided', async () => {
      const poolInstance = new Pool(provider, { POOL });
      const txObj = await poolInstance.swapCollateral({
        user,
        flash,
        fromAsset,
        fromAToken,
        toAsset,
        fromAmount,
        minToAmount,
        permitSignature,
        swapAll,
        onBehalfOf,
        referralCode,
        augustus,
        swapCallData,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when fromAsset not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAsset = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${fromAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when fromAToken not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAToken = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${fromAToken} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when toAsset not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const toAsset = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${toAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when augustus not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const augustus = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Address: ${augustus} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when fromAmount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAmount = '0';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Amount: ${fromAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when fromAmount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAmount = 'asdf';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Amount: ${fromAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when minToAmount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const minToAmount = '0';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Amount: ${minToAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when minToAmount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const minToAmount = 'asfd';
      await expect(async () =>
        poolInstance.swapCollateral({
          user,
          flash,
          fromAsset,
          fromAToken,
          toAsset,
          fromAmount,
          minToAmount,
          permitSignature,
          swapAll,
          onBehalfOf,
          referralCode,
          augustus,
          swapCallData,
        }),
      ).rejects.toThrowError(
        `Amount: ${minToAmount} needs to be greater than 0`,
      );
    });
  });
  describe('repayWithCollateral', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const fromAsset = '0x0000000000000000000000000000000000000007';
    const fromAToken = '0x0000000000000000000000000000000000000008';
    const assetToRepay = '0x0000000000000000000000000000000000000009';
    const onBehalfOf = '0x0000000000000000000000000000000000000010';
    const repayWithAmount = '12.34';
    const repayAmount = '13.56';
    const permitSignature = {
      amount: '1',
      deadline: '1',
      v: 1,
      r: '0x0000000000000000000000000000000000000000000000000000000000000001',
      s: '0x0000000000000000000000000000000000000000000000000000000000000001',
    };
    const repayAllDebt = true;
    const rateMode = InterestRate.None;
    const referralCode = '1';
    const flash = true;
    const useEthPath = true;

    const decimals = 18;

    const config = { POOL, REPAY_WITH_COLLATERAL_ADAPTER };

    const repayAmountWithSurplus: string = (
      Number(repayAmount) +
      (Number(repayAmount) * Number(SURPLUS)) / 100
    ).toString();

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params and approval needed for flash with rate mode None', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));
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

      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(2);
      const txObj = repayWithCollateralTxObj[1];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.repayCollateral].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed for flash with rate mode Stable', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const rateMode = InterestRate.Stable;
      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          1,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed for flash with rate mode Variable', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const rateMode = InterestRate.Variable;
      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed for flash without onBehalfOf', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        // onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(user);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed for flash without referralCode', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        // referralCode,
        flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed for flash without useEthPath', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        // useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          false,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmountWithSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no approval needed without flash and not repayAllDebt', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const repayWithCollateralTxObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        // repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(repayWithCollateralTxObj.length).toEqual(1);
      const txObj = repayWithCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          valueToWei(repayWithAmount, decimals),
          2,
          permitSignature.amount,
          permitSignature.deadline,
          permitSignature.v,
          permitSignature.r,
          permitSignature.s,
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(REPAY_WITH_COLLATERAL_ADAPTER);
      expect(decoded[1]).toEqual([assetToRepay]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(repayAmount, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(onBehalfOf);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and no permitSignature, and no flash', async () => {
      const poolInstance = new Pool(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const repaySpy = jest
        .spyOn(poolInstance.repayWithCollateralAdapterService, 'swapAndRepay')
        .mockReturnValue({} as EthereumTransactionTypeExtended);

      await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        // permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        // flash,
        useEthPath,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(repaySpy).toHaveBeenCalled();
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when REPAY_WITH_COLLATERAL_ADAPTER not provided', async () => {
      const poolInstance = new Pool(provider, { POOL });
      const txObj = await poolInstance.repayWithCollateral({
        user,
        fromAsset,
        fromAToken,
        assetToRepay,
        repayWithAmount,
        repayAmount,
        permitSignature,
        repayAllDebt,
        rateMode,
        onBehalfOf,
        referralCode,
        flash,
        useEthPath,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when fromAsset not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAsset = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${fromAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when fromAToken not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const fromAToken = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${fromAToken} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when assetToRepay not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const assetToRepay = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${assetToRepay} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when repayWithAmount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const repayWithAmount = '0';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${repayWithAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when repayWithAmount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const repayWithAmount = 'asdf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${repayWithAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when repayAmount not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const repayAmount = '0';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${repayAmount} needs to be greater than 0`,
      );
    });
    it('Expects to fail when repayAmount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const repayAmount = 'adf';
      await expect(async () =>
        poolInstance.repayWithCollateral({
          user,
          fromAsset,
          fromAToken,
          assetToRepay,
          repayWithAmount,
          repayAmount,
          permitSignature,
          repayAllDebt,
          rateMode,
          onBehalfOf,
          referralCode,
          flash,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${repayAmount} needs to be greater than 0`,
      );
    });
  });
  describe('flashLiquidation', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const collateralAsset = '0x0000000000000000000000000000000000000007';
    const borrowedAsset = '0x0000000000000000000000000000000000000008';
    const initiator = '0x0000000000000000000000000000000000000009';
    const debtTokenCover = '12.34';
    const useEthPath = true;
    const liquidateAll = true;

    const decimals = 18;

    const config = { POOL, FLASH_LIQUIDATION_ADAPTER };

    const amountSurplus = (
      Number(debtTokenCover) +
      (Number(debtTokenCover) * Number(debtTokenCover)) / 100
    ).toString();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the tx object passing all params', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const flashLiquidationTxObj = await poolInstance.flashLiquidation({
        user,
        collateralAsset,
        borrowedAsset,
        debtTokenCover,
        liquidateAll,
        initiator,
        useEthPath,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(flashLiquidationTxObj.length).toEqual(1);
      const txObj = flashLiquidationTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(initiator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        [
          collateralAsset,
          borrowedAsset,
          user,
          constants.MaxUint256.toString(),
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(FLASH_LIQUIDATION_ADAPTER);
      expect(decoded[1]).toEqual([borrowedAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(amountSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(initiator);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params without useEthPath', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const flashLiquidationTxObj = await poolInstance.flashLiquidation({
        user,
        collateralAsset,
        borrowedAsset,
        debtTokenCover,
        liquidateAll,
        initiator,
        // useEthPath,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(flashLiquidationTxObj.length).toEqual(1);
      const txObj = flashLiquidationTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(initiator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        [
          collateralAsset,
          borrowedAsset,
          user,
          constants.MaxUint256.toString(),
          false,
        ],
      );

      expect(decoded[0]).toEqual(FLASH_LIQUIDATION_ADAPTER);
      expect(decoded[1]).toEqual([borrowedAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(amountSurplus, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(initiator);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params and liquidateAll to false', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const liquidateAll = false;
      const flashLiquidationTxObj = await poolInstance.flashLiquidation({
        user,
        collateralAsset,
        borrowedAsset,
        debtTokenCover,
        liquidateAll,
        initiator,
        useEthPath,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(flashLiquidationTxObj.length).toEqual(1);
      const txObj = flashLiquidationTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(initiator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          'uint256[]',
          'uint256[]',
          'address',
          'bytes',
          'uint16',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      const params = utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'uint256', 'bool'],
        [
          collateralAsset,
          borrowedAsset,
          user,
          valueToWei(debtTokenCover, decimals),
          useEthPath,
        ],
      );

      expect(decoded[0]).toEqual(FLASH_LIQUIDATION_ADAPTER);
      expect(decoded[1]).toEqual([borrowedAsset]);
      expect(decoded[2]).toEqual([
        BigNumber.from(valueToWei(debtTokenCover, decimals)),
      ]);
      expect(decoded[3]).toEqual([BigNumber.from(0)]);
      expect(decoded[4]).toEqual(initiator);
      expect(decoded[5]).toEqual(params);
      expect(decoded[6]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.flashLiquidation({
        user,
        collateralAsset,
        borrowedAsset,
        debtTokenCover,
        liquidateAll,
        initiator,
        useEthPath,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when FLASH_LIQUIDATION_ADAPTER not provided', async () => {
      const poolInstance = new Pool(provider, { POOL });
      const txObj = await poolInstance.flashLiquidation({
        user,
        collateralAsset,
        borrowedAsset,
        debtTokenCover,
        liquidateAll,
        initiator,
        useEthPath,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when collateralAsset not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const collateralAsset = 'asdf';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${collateralAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when borrowedAsset not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const borrowedAsset = 'asdf';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${borrowedAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when initiator not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const initiator = 'asdf';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Address: ${initiator} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when debtTokenCover not positive', async () => {
      const poolInstance = new Pool(provider, config);
      const debtTokenCover = '0';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${debtTokenCover} needs to be greater than 0`,
      );
    });
    it('Expects to fail when debtTokenCover not number', async () => {
      const poolInstance = new Pool(provider, config);
      const debtTokenCover = 'asdf';
      await expect(async () =>
        poolInstance.flashLiquidation({
          user,
          collateralAsset,
          borrowedAsset,
          debtTokenCover,
          liquidateAll,
          initiator,
          useEthPath,
        }),
      ).rejects.toThrowError(
        `Amount: ${debtTokenCover} needs to be greater than 0`,
      );
    });
  });
  describe('repayWithATokens', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const amount = '123.456';
    const decimals = 18;
    const rateMode = InterestRate.None;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to fail if passing all params with repay eth address', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const poolInstance = new Pool(provider, config);

      await expect(async () =>
        poolInstance.repayWithATokens({
          user,
          reserve,
          amount,
          rateMode,
        }),
      ).rejects.toThrowError(
        'Can not repay with aTokens with eth. Should be WETH instead',
      );
    });
    it('Expects the tx object passing all params with amount -1 with reate stable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const amount = '-1';
      const rateMode = InterestRate.Stable;
      const reapyTxObj = await poolInstance.repayWithATokens({
        user,
        reserve,
        amount,
        rateMode,
      });

      expect(synthetixSpy).not.toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(1);
      const txObj = reapyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(constants.MaxUint256);
      expect(decoded[2]).toEqual(BigNumber.from(1));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object passing all params with with specific amount and rate variable', async () => {
      const poolInstance = new Pool(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const rateMode = InterestRate.Variable;
      const reapyTxObj = await poolInstance.repayWithATokens({
        user,
        reserve,
        amount,
        rateMode,
      });

      expect(decimalsSpy).toHaveBeenCalled();

      expect(reapyTxObj.length).toEqual(1);
      const txObj = reapyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(BigNumber.from(2));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', async () => {
      const poolInstance = new Pool(provider);
      const txObj = await poolInstance.repayWithATokens({
        user,
        reserve,
        amount,
        rateMode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.repayWithATokens({
          user,
          reserve,
          amount,
          rateMode,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const poolInstance = new Pool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.repayWithATokens({
          user,
          reserve,
          amount,
          rateMode,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount 0', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.repayWithATokens({
          user,
          reserve,
          amount,
          rateMode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const poolInstance = new Pool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        poolInstance.repayWithATokens({
          user,
          reserve,
          amount,
          rateMode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('setUserEMode', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const categoryId = 1;

    const config = { POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object when passing all params', async () => {
      const poolInstance = new Pool(provider, config);

      const setUserEModeTxObj = poolInstance.setUserEMode({
        user,
        categoryId,
      });

      expect(setUserEModeTxObj.length).toEqual(1);
      const txObj = setUserEModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['uint8'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(categoryId);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when PoolAddress not provided', () => {
      const poolInstance = new Pool(provider);
      const txObj = poolInstance.setUserEMode({
        user,
        categoryId,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', () => {
      const poolInstance = new Pool(provider, config);
      const user = 'asdf';
      expect(() =>
        poolInstance.setUserEMode({
          user,
          categoryId,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when categoryId not positive or 0', () => {
      const poolInstance = new Pool(provider, config);
      const categoryId = -1;
      expect(() =>
        poolInstance.setUserEMode({
          user,
          categoryId,
        }),
      ).toThrowError(
        `Amount: ${categoryId} needs to be greater or equal than 0`,
      );
    });
  });
});
