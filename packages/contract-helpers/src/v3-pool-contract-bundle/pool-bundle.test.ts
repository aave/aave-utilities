import { BigNumber, PopulatedTransaction, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  gasLimitRecommendations,
  valueToWei,
} from '../commons/utils';
import { IERC20Detailed } from '../erc20-contract/typechain/IERC20Detailed';
import { IERC20Detailed__factory } from '../erc20-contract/typechain/IERC20Detailed__factory';
import { PoolBundle } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('PoolBundle', () => {
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
  const L2_ENCODER = '0x0000000000000000000000000000000000000020';
  const mockResolve = async () => Promise.resolve({});
  const mockNullResolve = async () => Promise.resolve(null);
  const mockTx: EthereumTransactionTypeExtended = {
    tx: mockResolve,
    txType: eEthereumTxType.DLP_ACTION,
    gas: mockNullResolve,
  };
  describe('Initialization', () => {
    const config = {
      POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
      L2_ENCODER,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new PoolBundle(provider, config);
      expect(instance instanceof PoolBundle).toEqual(true);
    });
    it('Expects ot initialize correctly without passing configuration', () => {
      const instance = new PoolBundle(provider);
      expect(instance instanceof PoolBundle).toEqual(true);
    });
  });
  describe('supplyBundle', () => {
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
      const poolBundleInstance = new PoolBundle(provider, config);
      const supplyEthSpy = jest
        .spyOn(poolBundleInstance.wethGatewayService, 'depositETH')
        .mockReturnValue([mockTx]);
      await poolBundleInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(supplyEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters with asset already approval', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.action.to).toEqual(POOL);
      expect(supplyTxObj.action.from).toEqual(user);
      expect(supplyTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
      expect(supplyTxObj.action.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(supplyTxObj.action.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));
    });
    it('Expects the tx object passing all parameters with approval required', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        skipGasEstimation: true,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(supplyTxObj.action.to).toEqual(POOL);
      expect(supplyTxObj.action.from).toEqual(user);
      expect(supplyTxObj.action.gasLimit).toEqual(BigNumber.from('300000'));
      expect(supplyTxObj.action.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(supplyTxObj.action.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));
    });
    it('Expects the tx object passing all parameters with approval and gas estimation', async () => {
      const poolInstance = new PoolBundle(provider, config);
      jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(supplyTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
    });
    it('Expects the tx object passing all parameters with optimal path enabled', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      const optimalPoolSpy = jest
        .spyOn(poolInstance.l2PoolService, 'supply')
        .mockReturnValue(Promise.resolve([mockTx]));

      await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        useOptimizedPath: true,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(optimalPoolSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: PopulatedTransaction = supplyTxObj.action;
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(supplyTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
      expect(tx.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(user);
      expect(decoded[3]).toEqual(Number(referralCode));

      // gas price
      const { gasLimit } = supplyTxObj.action;
      expect(gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
    });
    it('Expects the tx object passing all parameters but not referral', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: PopulatedTransaction = supplyTxObj.action;
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
      expect(tx.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(0);

      const { gasLimit } = supplyTxObj.action;
      expect(gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
    });
    it('Expects the tx object passing all parameters and needing approval', async () => {
      const poolInstance = new PoolBundle(provider, config);

      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const supplyTxObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        skipApprovalChecks: true,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      // expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: PopulatedTransaction = supplyTxObj.action;
      expect(tx.to).toEqual(POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supply].recommended,
        ),
      );
      expect(tx.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));
    });
    it('Expects to fail when passing all params and supplying Synthetix but amount not valid', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.supplyBundle({
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
      const poolInstance = new PoolBundle(provider);
      const txObj = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.supplyBundle({
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
      const poolInstance = new PoolBundle(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.supplyBundle({
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
      const poolInstance = new PoolBundle(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.supplyBundle({
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
      const poolInstance = new PoolBundle(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.supplyBundle({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('generates signed supply action', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));

      const supplyBundle = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        deadline: '100',
        skipGasEstimation: true,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const signedAction = await supplyBundle.generateSignedAction({
        signatures: [signature],
      });
      expect(signedAction.from).toEqual(user);
      expect(signedAction.to).toEqual(POOL);
    });
    it('throws insufficient funds error', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));

      const supplyBundle = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        skipGasEstimation: true,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));
      await expect(async () =>
        supplyBundle.generateSignedAction({ signatures: [signature] }),
      ).rejects.toThrowError('Not enough funds to execute operation');
    });
    it('generates signed supply for L2Pool', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));
      const l2PoolSupplyWithPermitSpy = jest
        .spyOn(poolInstance.l2PoolService, 'supplyWithPermit')
        .mockReturnValue(Promise.resolve([mockTx]));
      const l2PoolSupplySpy = jest
        .spyOn(poolInstance.l2PoolService, 'supply')
        .mockReturnValue(Promise.resolve([mockTx]));

      const supplyBundle = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        skipGasEstimation: true,
        useOptimizedPath: true,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(l2PoolSupplySpy).toHaveBeenCalled();
      expect(l2PoolSupplyWithPermitSpy).toHaveBeenCalledTimes(0);

      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      await supplyBundle.generateSignedAction({ signatures: [signature] });

      expect(l2PoolSupplyWithPermitSpy).toHaveBeenCalled();
    });
    it('generates gas estimation for supplyWithPermit', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));

      const supplyBundle = await poolInstance.supplyBundle({
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

      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const signedAction = await supplyBundle.generateSignedAction({
        signatures: [signature],
      });

      expect(signedAction.to).toEqual(POOL);
      expect(signedAction.gasLimit).toEqual(BigNumber.from('350000'));
    });
    it('generates gas estimation for supplyWithPermit on L2Pool', async () => {
      const poolInstance = new PoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(provider, 'getGasPrice')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
      const approveSpy = jest
        .spyOn(poolInstance.erc20Service, 'approveTxData')
        .mockReturnValue(Promise.resolve({}));
      jest.spyOn(IERC20Detailed__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(18),
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
        name: async () => Promise.resolve(''),
        symbol: async () => Promise.resolve(''),
      } as unknown as IERC20Detailed);
      jest
        .spyOn(poolInstance.v3PoolService, 'signERC20Approval')
        .mockReturnValue(Promise.resolve(''));
      const l2PoolSupplyWithPermitSpy = jest
        .spyOn(poolInstance.l2PoolService, 'supplyWithPermit')
        .mockReturnValue(Promise.resolve([mockTx]));
      const l2PoolSupplySpy = jest
        .spyOn(poolInstance.l2PoolService, 'supply')
        .mockReturnValue(Promise.resolve([mockTx]));

      const supplyBundle = await poolInstance.supplyBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        useOptimizedPath: true,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(l2PoolSupplySpy).toHaveBeenCalled();
      expect(l2PoolSupplyWithPermitSpy).toHaveBeenCalledTimes(0);

      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const signedAction = await supplyBundle.generateSignedAction({
        signatures: [signature],
      });

      expect(signedAction.gasLimit).toEqual(BigNumber.from('350000'));

      expect(l2PoolSupplyWithPermitSpy).toHaveBeenCalled();
    });
  });
});
