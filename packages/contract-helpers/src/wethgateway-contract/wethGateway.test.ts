import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  transactionType,
} from '../commons/types';
import { parseNumber } from '../commons/utils';
import { ERC20Service } from '../erc20-contract';
import { WETHGatewayService } from './index';
// import { IWETHGateway } from './typechain/IWETHGateway';
// import { IWETHGateway__factory } from './typechain/IWETHGateway__factory';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('WethGatewayService', () => {
  const wethGatewayAddress = '0x0000000000000000000000000000000000000001';
  const lendingPool = '0x0000000000000000000000000000000000000002';
  describe('Initialization', () => {
    const provider: providers.Provider = new providers.JsonRpcProvider();
    const erc20Service = new ERC20Service(provider);
    it('Expects to be initialized', () => {
      expect(
        () =>
          new WETHGatewayService(provider, erc20Service, wethGatewayAddress),
      ).not.toThrow();
    });
  });
  describe('depositETH', () => {
    const user = '0x0000000000000000000000000000000000000003';
    const onBehalfOf = '0x0000000000000000000000000000000000000004';
    const amount = '123.456';
    const referralCode = '0';
    const provider: providers.Provider = new providers.JsonRpcProvider();
    jest
      .spyOn(provider, 'getGasPrice')
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
    const erc20Service = new ERC20Service(provider);
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the deposit tx object to be correct with all params', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const txObj = weth.depositETH({
        lendingPool,
        user,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(onBehalfOf);
      expect(decoded[2]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the deposit tx object to be correct without onBehalfOf', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const txObj = weth.depositETH({
        lendingPool,
        user,
        amount,
        referralCode,
      });
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(user);
      expect(decoded[2]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the deposit tx object to be correct without referralCode', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const txObj = weth.depositETH({
        lendingPool,
        user,
        amount,
      });
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(user);
      expect(decoded[2]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when user is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const user = 'asdf';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when lendingPool is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const lendingPool = 'asdf';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Address: ${lendingPool} is not a valid ethereum Address`);
    });
    it('Expects to fail when amount is not positive', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const amount = '0';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount is not number', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const amount = 'asdf';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when onBehalfOf is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const onBehalfOf = 'asdf';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Address: ${onBehalfOf} is not a valid ethereum Address`);
    });
    it('Expects to fail when referral is not number', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const referralCode = 'asdf';
      expect(() =>
        weth.depositETH({
          lendingPool,
          user,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).toThrowError(`Amount: ${referralCode} needs to be greater than 0`);
    });
  });
  describe('withdrawETH', () => {
    const user = '0x0000000000000000000000000000000000000003';
    const debtTokenAddress = '0x0000000000000000000000000000000000000005';
    const interestRateMode = InterestRate.Stable;
    const amount = '123.456';
    const referralCode = '0';
    const provider: providers.Provider = new providers.JsonRpcProvider();
    jest
      .spyOn(provider, 'getGasPrice')
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
    const erc20Service = new ERC20Service(provider);

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the borrow tx object to be correct with all params and variable stable rate without approval', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );

      const isApprovedSpy = jest
        .spyOn(weth.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementation(async () => Promise.resolve(false));

      const approveSpy = jest
        .spyOn(weth.baseDebtTokenService, 'approveDelegation')
        .mockImplementation(() => ({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        }));
      const interestRateMode = InterestRate.Variable;
      const txObj = await weth.borrowETH({
        lendingPool,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
        referralCode,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(approveSpy).toHaveBeenCalled();
      expect(txObj.length).toEqual(2);
      expect(txObj[1].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[1].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(BigNumber.from(parseNumber(amount, 18)));
      expect(decoded[2]).toEqual(BigNumber.from(2));
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj[1].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('450000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the borrow tx object to be correct with all params and stable stable rate already approved', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );

      const isApprovedSpy = jest
        .spyOn(weth.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementation(async () => Promise.resolve(true));

      const txObj = await weth.borrowETH({
        lendingPool,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
        referralCode,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(BigNumber.from(parseNumber(amount, 18)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the borrow tx object to be correct with all params and none stable rate', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );

      const isApprovedSpy = jest
        .spyOn(weth.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementation(async () => Promise.resolve(true));

      const interestRateMode = InterestRate.None;
      const txObj = await weth.borrowETH({
        lendingPool,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
        referralCode,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(BigNumber.from(parseNumber(amount, 18)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the borrow tx object to be correct without referralCode', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );

      const isApprovedSpy = jest
        .spyOn(weth.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementation(async () => Promise.resolve(true));

      const interestRateMode = InterestRate.None;
      const txObj = await weth.borrowETH({
        lendingPool,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
      });

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(txObj.length).toEqual(1);
      expect(txObj[0].txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj[0].tx();
      expect(tx.to).toEqual(wethGatewayAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(lendingPool);
      expect(decoded[1]).toEqual(BigNumber.from(parseNumber(amount, 18)));
      expect(decoded[2]).toEqual(BigNumber.from(1));
      expect(decoded[3]).toEqual(0);

      // gas price
      const gasPrice: GasType | null = await txObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when user is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const user = 'asdf';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when lendingPool is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const lendingPool = 'asdf';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${lendingPool} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount is not positive', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const amount = '0';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount is not number', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const amount = 'asdf';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when debtTokenAddress is not address', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const debtTokenAddress = 'asdf';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Address: ${debtTokenAddress} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when referral is not number', async () => {
      const weth = new WETHGatewayService(
        provider,
        erc20Service,
        wethGatewayAddress,
      );
      const referralCode = 'asdf';
      await expect(async () =>
        weth.borrowETH({
          lendingPool,
          user,
          amount,
          debtTokenAddress,
          interestRateMode,
          referralCode,
        }),
      ).rejects.toThrowError(
        `Amount: ${referralCode} needs to be greater than 0`,
      );
    });
  });
  describe('repayETH', () => {
    it('Expects the withdraw tx object to be correct with all params', async () => {});
    it('Expects the withdraw tx object to be correct without onBehalfOf', async () => {});
    it('Expects to fail when user is not address', async () => {});
    it('Expects to fail when lendingPool is not address', async () => {});
    it('Expects to fail when amount is not positive', async () => {});
    it('Expects to fail when amount is not number', async () => {});
    it('Expects to fail when aTokenAddress is not address', async () => {});
    it('Expects to fail when onBehalfOf is not address', async () => {});
  });
  describe('borrowETH', () => {
    it('Expects the repay tx object to be correct with all params', async () => {});
    it('Expects the repay tx object to be correct without onBehalfOf', async () => {});
    it('Expects to fail when user is not address', async () => {});
    it('Expects to fail when lendingPool is not address', async () => {});
    it('Expects to fail when amount is not positive', async () => {});
    it('Expects to fail when amount is not number', async () => {});
    it('Expects to fail when onBehalfOf is not address', async () => {});
  });
});
