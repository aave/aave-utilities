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
      LENDING_POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
      L2_ENCODER,
    };
    it('Expects to initialize correctly with all params', () => {
      const instance = new LendingPoolBundle(provider, config);
      expect(instance instanceof LendingPoolBundle).toEqual(true);
    });
    it('Expects ot initialize correctly without passing configuration', () => {
      const instance = new LendingPoolBundle(provider);
      expect(instance instanceof LendingPoolBundle).toEqual(true);
    });
  });
  describe('depositBundle', () => {
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
      const poolBundleInstance = new LendingPoolBundle(provider, config);
      const depositEthSpy = jest
        .spyOn(poolBundleInstance.wethGatewayService, 'depositETH')
        .mockReturnValue([mockTx]);
      await poolBundleInstance.depositBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(depositEthSpy).toHaveBeenCalled();
    });
    it('Expects the tx object passing all parameters with asset already approval', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.depositBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      expect(depositTxObj.action.to).toEqual(LENDING_POOL);
      expect(depositTxObj.action.from).toEqual(user);
      expect(depositTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
        ),
      );
      expect(depositTxObj.action.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(depositTxObj.action.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));
    });
    it('Expects the tx object passing all parameters with approval required', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
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

      const depositTxObj = await poolInstance.depositBundle({
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
      expect(depositTxObj.approvalRequired).toEqual(true);
      expect(depositTxObj.action.to).toEqual(LENDING_POOL);
      expect(depositTxObj.action.from).toEqual(user);
      expect(depositTxObj.action.gasLimit).toEqual(BigNumber.from('300000'));
      expect(depositTxObj.action.value).toEqual(undefined);

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'address', 'uint16'],
        utils.hexDataSlice(depositTxObj.action.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, decimals)));
      expect(decoded[2]).toEqual(onBehalfOf);
      expect(decoded[3]).toEqual(Number(referralCode));
    });
    it('Expects the tx object passing all parameters with approval and gas estimation', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
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

      const depositTxObj = await poolInstance.depositBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });

      expect(depositTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
        ),
      );

      expect(depositTxObj.signatureRequests.length).toEqual(0);
      const signedAction = await depositTxObj.generateSignedAction({
        signatures: [],
      });
      expect(signedAction).toEqual({});
    });
    it('Expects the tx object passing all parameters but not onBehalfOf', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.depositBundle({
        user,
        reserve,
        amount,
        referralCode,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: PopulatedTransaction = depositTxObj.action;
      expect(tx.to).toEqual(LENDING_POOL);
      expect(tx.from).toEqual(user);
      expect(depositTxObj.action.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
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
      const { gasLimit } = depositTxObj.action;
      expect(gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
        ),
      );
    });
    it('Expects the tx object passing all parameters but not referral', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
      const isApprovedSpy = jest
        .spyOn(poolInstance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => true);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.depositBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
      });

      expect(synthetixSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: PopulatedTransaction = depositTxObj.action;
      expect(tx.to).toEqual(LENDING_POOL);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
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

      const { gasLimit } = depositTxObj.action;
      expect(gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
        ),
      );
    });
    it('Expects the tx object passing all parameters with approval skipped', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);

      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(true));

      const depositTxObj = await poolInstance.depositBundle({
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

      const tx: PopulatedTransaction = depositTxObj.action;
      expect(tx.to).toEqual(LENDING_POOL);
      expect(tx.from).toEqual(user);
      expect(depositTxObj.approvalRequired).toEqual(false);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].recommended,
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
    it('Expects to fail when passing all params and depositing Synthetix but amount not valid', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
      const decimalsSpy = jest
        .spyOn(poolInstance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const synthetixSpy = jest
        .spyOn(poolInstance.synthetixService, 'synthetixValidation')
        .mockReturnValue(Promise.resolve(false));

      await expect(async () =>
        poolInstance.depositBundle({
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
      const poolInstance = new LendingPoolBundle(provider);
      const txObj = await poolInstance.depositBundle({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not and eth address', async () => {
      const poolInstance = new LendingPoolBundle(provider, config);
      const user = 'asdf';
      await expect(async () =>
        poolInstance.depositBundle({
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
      const poolInstance = new LendingPoolBundle(provider, config);
      const reserve = 'asdf';
      await expect(async () =>
        poolInstance.depositBundle({
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
      const poolInstance = new LendingPoolBundle(provider, config);
      const onBehalfOf = 'asdf';
      await expect(async () =>
        poolInstance.depositBundle({
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
      const poolInstance = new LendingPoolBundle(provider, config);
      const amount = '0';
      await expect(async () =>
        poolInstance.depositBundle({
          user,
          reserve,
          amount,
          onBehalfOf,
          referralCode,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
});
