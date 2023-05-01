import { BigNumber, providers, utils } from 'ethers';
import { eEthereumTxType, GasType, transactionType } from '../commons/types';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { IDebtTokenBase } from './typechain/IDebtTokenBase';
import { IDebtTokenBase__factory } from './typechain/IDebtTokenBase__factory';
import { BaseDebtToken, BaseDebtTokenInterface } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('BaseDebtTokenService', () => {
  describe('Initialization', () => {
    it('Expects to be initialized correctly', () => {
      const provider: providers.Provider = new providers.JsonRpcProvider();
      const erc20Service = new ERC20Service(provider);
      expect(() => new BaseDebtToken(provider, erc20Service)).not.toThrow();
    });
  });
  describe('generateApproveDelegationTxData', () => {
    const provider: providers.Provider = new providers.JsonRpcProvider();

    const erc20Service = new ERC20Service(provider);

    const debtToken = new BaseDebtToken(provider, erc20Service);
    const user = '0x0000000000000000000000000000000000000001';
    const delegatee = '0x0000000000000000000000000000000000000002';
    const debtTokenAddress = '0x0000000000000000000000000000000000000003';
    const amount = '1000000';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Generates an approveDelegation tx with correct parameters', () => {
      const delegation = debtToken.generateApproveDelegationTxData({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      });

      expect(delegation.to).toEqual(debtTokenAddress);
      expect(delegation.from).toEqual(user);
      expect(delegation.data).toEqual(
        '0xc04a8a10000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000f4240',
      );
      expect(delegation.value).toEqual(undefined);
    });

    it('Expected to throw an error with invalid parameters', () => {
      const user = 'asdf';
      expect(() =>
        debtToken.generateApproveDelegationTxData({
          user,
          delegatee,
          debtTokenAddress,
          amount,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });

    it('Expected to throw an error with invalid parameters', () => {
      const delegatee = 'asdf';
      expect(() =>
        debtToken.generateApproveDelegationTxData({
          user,
          delegatee,
          debtTokenAddress,
          amount,
        }),
      ).toThrowError(`Address: ${delegatee} is not a valid ethereum Address`);
    });
    it('Expected to throw an error with invalid parameters', () => {
      const debtTokenAddress = 'asdf';
      expect(() =>
        debtToken.generateApproveDelegationTxData({
          user,
          delegatee,
          debtTokenAddress,
          amount,
        }),
      ).toThrowError(
        `Address: ${debtTokenAddress} is not a valid ethereum Address`,
      );
    });
    it('Expected to throw an error with invalid parameters', () => {
      const amount = '-1';
      expect(() =>
        debtToken.generateApproveDelegationTxData({
          user,
          delegatee,
          debtTokenAddress,
          amount,
        }),
      ).toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
});
describe('approveDelegation', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  const erc20Service = new ERC20Service(provider);
  jest.spyOn(erc20Service, 'decimalsOf').mockImplementation(async () => 6);

  const debtToken = new BaseDebtToken(provider, erc20Service);
  const user = '0x0000000000000000000000000000000000000001';
  const delegatee = '0x0000000000000000000000000000000000000002';
  const debtTokenAddress = '0x0000000000000000000000000000000000000003';
  const amount = '1000000';

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Expects tx Object for approval when all params are correct', async () => {
    const approveTxObj = debtToken.approveDelegation({
      user,
      delegatee,
      debtTokenAddress,
      amount,
    });

    expect(approveTxObj.txType).toEqual(eEthereumTxType.ERC20_APPROVAL);

    const tx: transactionType = await approveTxObj.tx();
    expect(tx.to).toEqual(debtTokenAddress);
    expect(tx.from).toEqual(user);
    expect(tx.gasLimit).toEqual(BigNumber.from(1));

    const decoded = utils.defaultAbiCoder.decode(
      ['address', 'uint256'],
      utils.hexDataSlice(tx.data ?? '', 4),
    );

    expect(decoded[0]).toEqual(delegatee);
    expect(decoded[1]).toEqual(BigNumber.from(amount));

    // gas price
    const gasPrice: GasType | null = await approveTxObj.gas();
    expect(gasPrice).not.toBeNull();
    expect(gasPrice?.gasLimit).toEqual('1');
    expect(gasPrice?.gasPrice).toEqual('1');
  });
  it('Expects to fail when user is wrong address', () => {
    const user = 'asdf';
    expect(() =>
      debtToken.approveDelegation({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      }),
    ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
  });
  it('Expects to fail when delegatee is wrong address', () => {
    const delegatee = 'asdf';
    expect(() =>
      debtToken.approveDelegation({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      }),
    ).toThrowError(`Address: ${delegatee} is not a valid ethereum Address`);
  });
  it('Expects to fail when debtTokenAddress is wrong address', () => {
    const debtTokenAddress = 'asdf';
    expect(() =>
      debtToken.approveDelegation({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      }),
    ).toThrowError(
      `Address: ${debtTokenAddress} is not a valid ethereum Address`,
    );
  });
  it('Expects to fail when amount is not number', () => {
    const amount = 'asdf';
    expect(() =>
      debtToken.approveDelegation({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      }),
    ).toThrowError(`Amount: ${amount} needs to be greater than 0`);
  });
  it('Expects to fail when amount is not positive', () => {
    const amount = '0';
    expect(() =>
      debtToken.approveDelegation({
        user,
        delegatee,
        debtTokenAddress,
        amount,
      }),
    ).toThrowError(`Amount: ${amount} needs to be greater than 0`);
  });
});
describe('isDelegationApproved', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  const erc20Service = new ERC20Service(provider);
  jest.spyOn(erc20Service, 'decimalsOf').mockImplementation(async () => 6);

  const debtTokenAddress = '0x0000000000000000000000000000000000000001';
  const allowanceGiver = '0x0000000000000000000000000000000000000002';
  const allowanceReceiver = '0x0000000000000000000000000000000000000003';
  const amount = '123.456';

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Expects to return approved if all params ok', async () => {
    const spy = jest.spyOn(IDebtTokenBase__factory, 'connect').mockReturnValue({
      borrowAllowance: async () => Promise.resolve(BigNumber.from(10000000000)),
    } as unknown as IDebtTokenBase);
    const debtToken = new BaseDebtToken(provider, erc20Service);

    const isApproved = await debtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount,
    });

    expect(spy).toBeCalled();
    expect(isApproved).toEqual(true);
  });
  it('Expects to return not approved if all params ok', async () => {
    const spy = jest.spyOn(IDebtTokenBase__factory, 'connect').mockReturnValue({
      borrowAllowance: async () => Promise.resolve(BigNumber.from(1000000)),
    } as unknown as IDebtTokenBase);
    const debtToken = new BaseDebtToken(provider, erc20Service);

    const isApproved = await debtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount,
    });

    expect(spy).toBeCalled();
    expect(isApproved).toEqual(false);
  });
  it('Expects to return approved or not approved if amount is in native decimals', async () => {
    const spy = jest.spyOn(IDebtTokenBase__factory, 'connect').mockReturnValue({
      borrowAllowance: async () =>
        Promise.resolve(BigNumber.from('20000000000')),
    } as unknown as IDebtTokenBase);
    const debtToken = new BaseDebtToken(provider, erc20Service);

    const isApproved = await debtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount: '10000000000',
      nativeDecimals: true,
    });

    expect(spy).toBeCalled();
    expect(isApproved).toEqual(true);

    const isApprovedValidExact = await debtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount: '20000000000',
      nativeDecimals: true,
    });

    expect(spy).toBeCalled();
    expect(isApprovedValidExact).toEqual(true);

    const isApprovedInvalid = await debtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount: '30000000000',
      nativeDecimals: true,
    });

    expect(spy).toBeCalled();
    expect(isApprovedInvalid).toEqual(false);
  });
  it('Expects to fail when debtTokenAddress is wrong address', async () => {
    const debtToken = new BaseDebtToken(provider, erc20Service);
    const debtTokenAddress = 'asdf';
    await expect(async () =>
      debtToken.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver,
        allowanceReceiver,
        amount,
      }),
    ).rejects.toThrowError(
      `Address: ${debtTokenAddress} is not a valid ethereum Address`,
    );
  });
  it('Expects to fail when allowanceGiver is wrong address', async () => {
    const debtToken = new BaseDebtToken(provider, erc20Service);
    const allowanceGiver = 'asdf';
    await expect(async () =>
      debtToken.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver,
        allowanceReceiver,
        amount,
      }),
    ).rejects.toThrowError(
      `Address: ${allowanceGiver} is not a valid ethereum Address`,
    );
  });
  it('Expects to fail when allowanceReceiver is wrong address', async () => {
    const debtToken = new BaseDebtToken(provider, erc20Service);
    const allowanceReceiver = 'asdf';
    await expect(async () =>
      debtToken.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver,
        allowanceReceiver,
        amount,
      }),
    ).rejects.toThrowError(
      `Address: ${allowanceReceiver} is not a valid ethereum Address`,
    );
  });
  it('Expects to fail when amount is not number', async () => {
    const debtToken = new BaseDebtToken(provider, erc20Service);
    const amount = 'asdf';
    await expect(async () =>
      debtToken.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver,
        allowanceReceiver,
        amount,
      }),
    ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
  });
  it('Expects to fail when amount is 0', async () => {
    const debtToken = new BaseDebtToken(provider, erc20Service);
    const amount = '0';
    await expect(async () =>
      debtToken.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver,
        allowanceReceiver,
        amount,
      }),
    ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
  });
});

describe('approvedDelegationAmount', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  const user = '0x0000000000000000000000000000000000000001';
  const debtTokenAddress = '0x0000000000000000000000000000000000000002';
  const delegatee = '0x0000000000000000000000000000000000000003';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Expects to return correct approval amount', async () => {
    jest.spyOn(IDebtTokenBase__factory, 'connect').mockReturnValue({
      borrowAllowance: async () =>
        Promise.resolve(BigNumber.from('100000000000000000')),
    } as unknown as IDebtTokenBase);

    const erc20Service: IERC20ServiceInterface = new ERC20Service(provider);
    const decimalsSpy = jest
      .spyOn(erc20Service, 'decimalsOf')
      .mockImplementation(async () => Promise.resolve(6));

    const debtTokenService: BaseDebtTokenInterface = new BaseDebtToken(
      provider,
      erc20Service,
    );

    const approvedAmount: number =
      await debtTokenService.approvedDelegationAmount({
        user,
        delegatee,
        debtTokenAddress,
      });

    expect(decimalsSpy).toHaveBeenCalled();
    // 100000000000000000 / 10^6 = 100000000000
    expect(approvedAmount).toEqual(100000000000);
  });
});
