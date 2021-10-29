import { BigNumber, constants, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  DEFAULT_NULL_VALUE_ON_TX,
  gasLimitRecommendations,
  valueToWei,
} from '../commons/utils';
import { LendingPool } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('LendingPool', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const LENDING_POOL = '0x0000000000000000000000000000000000000001';
  const WETH_GATEWAY = '0x0000000000000000000000000000000000000002';
  const FLASH_LIQUIDATION_ADAPTER =
    '0x0000000000000000000000000000000000000003';
  const REPAY_WITH_COLLATERAL_ADAPTER =
    '0x0000000000000000000000000000000000000004';
  const SWAP_COLLATERAL_ADAPTER = '0x0000000000000000000000000000000000000005';

  describe('Initialization', () => {
    const config = {
      LENDING_POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new LendingPool(provider, config);
      expect(instance instanceof LendingPool).toEqual(true);
    });
    it('Expects ot initialize correctly without passing configuration', () => {
      const instance = new LendingPool(provider);
      expect(instance instanceof LendingPool).toEqual(true);
    });
  });
  describe('deposit', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const amount = '123.456';
    const decimals = 18;
    const referralCode = '1';

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all parameters with eth deposit', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const lendingPoolInstance = new LendingPool(provider, config);
      const depositEthSpy = jest
        .spyOn(lendingPoolInstance.wethGatewayService, 'depositETH')
        .mockReturnValue([]);
      await lendingPoolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(depositEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters without approval need', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await lendingPoolInstance.deposit({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await lendingPoolInstance.deposit({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await lendingPoolInstance.deposit({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const approveSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await lendingPoolInstance.deposit({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        lendingPoolInstance.deposit({
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
    it('Expects to fail when lendingPoolAddress not provided', async () => {
      const lendingPoolInstance = new LendingPool(provider);
      const txObj = await lendingPoolInstance.deposit({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        lendingPoolInstance.deposit({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        lendingPoolInstance.deposit({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        lendingPoolInstance.deposit({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = '0';
      await expect(async () =>
        lendingPoolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        lendingPoolInstance.deposit({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('withdraw', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const onBehalfOf = '0x0000000000000000000000000000000000000008';
    const aTokenAddress = '0x0000000000000000000000000000000000000009';
    const amount = '123.456';
    const decimals = 18;

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the tx object passing all parameters for eth withdraw', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const lendingPoolInstance = new LendingPool(provider, config);
      const withdrawEthSpy = jest
        .spyOn(lendingPoolInstance.wethGatewayService, 'withdrawETH')
        .mockReturnValue(Promise.resolve([]));
      await lendingPoolInstance.withdraw({
        user,
        reserve,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
      expect(withdrawEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const depositTxObj = await lendingPoolInstance.withdraw({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const amount = '-1';
      const depositTxObj = await lendingPoolInstance.withdraw({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);

      await expect(async () =>
        lendingPoolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
        }),
      ).rejects.toThrowError(
        'To withdraw ETH you need to pass the aWETH token address',
      );
    });
    it('Expects to fail when lendingPoolAddress not provided', async () => {
      const lendingPoolInstance = new LendingPool(provider);
      const txObj = await lendingPoolInstance.withdraw({
        user,
        reserve,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        lendingPoolInstance.withdraw({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        lendingPoolInstance.withdraw({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        lendingPoolInstance.withdraw({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const aTokenAddress = 'asdf';
      await expect(async () =>
        lendingPoolInstance.withdraw({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = '0';
      await expect(async () =>
        lendingPoolInstance.withdraw({
          user,
          reserve,
          amount,
          onBehalfOf,
          aTokenAddress,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        lendingPoolInstance.withdraw({
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

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all parameters with borrow eth', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const lendingPoolInstance = new LendingPool(provider, config);
      const borrowEthSpy = jest
        .spyOn(lendingPoolInstance.wethGatewayService, 'borrowETH')
        .mockReturnValue(Promise.resolve([]));
      await lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const borrowTxObj = await lendingPoolInstance.borrow({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const interestRateMode = InterestRate.Stable;
      const borrowTxObj = await lendingPoolInstance.borrow({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const interestRateMode = InterestRate.Variable;
      const borrowTxObj = await lendingPoolInstance.borrow({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);

      await expect(async () =>
        lendingPoolInstance.borrow({
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
    it('Expects to fail when lendingPoolAddress not provided', async () => {
      const lendingPoolInstance = new LendingPool(provider);

      const txs = await lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const debtTokenAddress = 'asdf';
      await expect(async () =>
        lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = '0';
      await expect(async () =>
        lendingPoolInstance.borrow({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = 'asfd';
      await expect(async () =>
        lendingPoolInstance.borrow({
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

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with repay eth', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const lendingPoolInstance = new LendingPool(provider, config);
      const repayEthSpy = jest
        .spyOn(lendingPoolInstance.wethGatewayService, 'repayETH')
        .mockReturnValue([]);
      await lendingPoolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });
      expect(repayEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all params without onBehalfOf and no approval', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await lendingPoolInstance.repay({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const approveSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const amount = '-1';
      const interestRateMode = InterestRate.Stable;
      const reapyTxObj = await lendingPoolInstance.repay({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const isApprovedSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const approveSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });
      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const interestRateMode = InterestRate.Variable;
      const reapyTxObj = await lendingPoolInstance.repay({
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
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const decimalsSpy = jest
        .spyOn(lendingPoolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const synthetixSpy = jest
        .spyOn(lendingPoolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        lendingPoolInstance.repay({
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
    it('Expects to fail when lendingPoolAddress not provided', async () => {
      const lendingPoolInstance = new LendingPool(provider);
      const txObj = await lendingPoolInstance.repay({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      await expect(async () =>
        lendingPoolInstance.repay({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        lendingPoolInstance.repay({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        lendingPoolInstance.repay({
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = '0';
      await expect(async () =>
        lendingPoolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const amount = 'asdf';
      await expect(async () =>
        lendingPoolInstance.repay({
          user,
          reserve,
          amount,
          interestRateMode,
          onBehalfOf,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('swapBorrowRateMode', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const interestRateMode = InterestRate.None;

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with Inerest rate None', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);

      const swapBorrowRateModeTxObj = lendingPoolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const interestRateMode = InterestRate.Stable;
      const swapBorrowRateModeTxObj = lendingPoolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);
      const interestRateMode = InterestRate.Variable;
      const swapBorrowRateModeTxObj = lendingPoolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });

      expect(swapBorrowRateModeTxObj.length).toEqual(1);
      const txObj = swapBorrowRateModeTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(LENDING_POOL);
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
    it('Expects to fail when lendingPoolAddress not provided', () => {
      const lendingPoolInstance = new LendingPool(provider);
      const txObj = lendingPoolInstance.swapBorrowRateMode({
        user,
        reserve,
        interestRateMode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      expect(() =>
        lendingPoolInstance.swapBorrowRateMode({
          user,
          reserve,
          interestRateMode,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when reserve not and eth address', () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      expect(() =>
        lendingPoolInstance.swapBorrowRateMode({
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

    const config = { LENDING_POOL };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object passing all params with usage as collateral true', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);

      const setUsageAsCollateralTxObj =
        lendingPoolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        });

      expect(setUsageAsCollateralTxObj.length).toEqual(1);
      const txObj = setUsageAsCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(LENDING_POOL);
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
      const lendingPoolInstance = new LendingPool(provider, config);

      const usageAsCollateral = false;
      const setUsageAsCollateralTxObj =
        lendingPoolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        });

      expect(setUsageAsCollateralTxObj.length).toEqual(1);
      const txObj = setUsageAsCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(LENDING_POOL);
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
    it('Expects to fail when lendingPoolAddress not provided', () => {
      const lendingPoolInstance = new LendingPool(provider);
      const txObj = lendingPoolInstance.setUsageAsCollateral({
        user,
        reserve,
        usageAsCollateral,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const user = 'asdf';
      expect(() =>
        lendingPoolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when reserve not and eth address', async () => {
      const lendingPoolInstance = new LendingPool(provider, config);
      const reserve = 'asdf';
      expect(() =>
        lendingPoolInstance.setUsageAsCollateral({
          user,
          reserve,
          usageAsCollateral,
        }),
      ).toThrowError(`Address: ${reserve} is not a valid ethereum Address`);
    });
  });
  describe('liquidationCall', () => {
    it('Expects the tx object passing all params and no approval needed', async () => {});
    it('Expects the tx object passing all params but not passing getAToken and no approval needed', async () => {});
    it('Expects the tx object passing all params but not passing liquidateAll with approval needed', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', () => {});
    it('Expects to fail when liquidator not and eth address', async () => {});
    it('Expects to fail when liquidatedUser not and eth address', async () => {});
    it('Expects to fail when debtReserve not and eth address', async () => {});
    it('Expects to fail when collateralReserve not and eth address', async () => {});
    it('Expects to fail when purchaseAmount not positive', async () => {});
    it('Expects to fail when purchaseAmount not number', async () => {});
  });
  describe('swapCollateral', () => {
    it('Expects the tx object passing all params and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params without onBehalf and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params without referralCode and no approval needed for flash', async () => {});
    it('Expects the tx object passing all params and no approval needed with flash and swapAll', async () => {});
    it('Expects the tx object passing all params and no approval needed with flash and not swapAll', async () => {});
    it('Expects the tx object passing all params without permitSignature and no approval needed without flash', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when SWAP_COLLATERAL_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when fromAsset not and eth address', async () => {});
    it('Expects to fail when fromAToken not and eth address', async () => {});
    it('Expects to fail when toAsset not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when augustus not and eth address', async () => {});
    it('Expects to fail when fromAmount not positive', async () => {});
    it('Expects to fail when fromAmount not number', async () => {});
    it('Expects to fail when minToAmount not positive', async () => {});
    it('Expects to fail when minToAmount not number', async () => {});
  });
  describe('repayWithCollateral', () => {
    it('Expects the tx object passing all params and no approval needed for flash with rate mode None', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash with rate mode Stable', async () => {});
    it('Expects the tx object passing all params and approval needed for flash with rate mode Variable', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without onBehalfOf', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without referralCode', async () => {});
    it('Expects the tx object passing all params and no approval needed for flash without useEthPath', async () => {});
    it('Expects the tx object passing all params and no approval needed without flash and repayAllDebt', async () => {});
    it('Expects the tx object passing all params and no approval needed without flash and not repayAllDebt', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when REPAY_WITH_COLLATERAL_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when fromAsset not and eth address', async () => {});
    it('Expects to fail when fromAToken not and eth address', async () => {});
    it('Expects to fail when assetToRepay not and eth address', async () => {});
    it('Expects to fail when onBehalfOf not and eth address', async () => {});
    it('Expects to fail when repayWithAmount not positive', async () => {});
    it('Expects to fail when repayWithAmount not number', async () => {});
    it('Expects to fail when repayAmount not positive', async () => {});
    it('Expects to fail when repayAmount not number', async () => {});
  });
  describe('flashLiquidation', () => {
    it('Expects the tx object passing all params', async () => {});
    it('Expects the tx object passing all params without useEthPath', async () => {});
    it('Expects the tx object passing all params and liquidateAll to false', async () => {});
    it('Expects to fail when lendingPoolAddress not provided', async () => {});
    it('Expects to fail when FLASH_LIQUIDATION_ADAPTER not provided', async () => {});
    it('Expects to fail when user not and eth address', async () => {});
    it('Expects to fail when collateralAsset not and eth address', async () => {});
    it('Expects to fail when borrowedAsset not and eth address', async () => {});
    it('Expects to fail when initiator not and eth address', async () => {});
    it('Expects to fail when debtTokenCover not positive', async () => {});
    it('Expects to fail when debtTokenCover not number', async () => {});
  });
});
