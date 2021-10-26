import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  transactionType,
} from '../commons/types';
import { RepayWithCollateralAdapterService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('RepayWithCollateralAdapterService', () => {
  const repayWithCollateralAddress =
    '0x0000000000000000000000000000000000000001';
  describe('Initialize', () => {
    const provider = new providers.JsonRpcProvider();
    it('Expects to initialize the service with all params', () => {
      expect(
        () =>
          new RepayWithCollateralAdapterService(
            provider,
            repayWithCollateralAddress,
          ),
      ).not.toThrow();
    });
    it('Expects to initialize the service without repayWithCollateralAddress', () => {
      expect(
        () => new RepayWithCollateralAdapterService(provider),
      ).not.toThrow();
    });
  });
  describe('swapAndRepay', () => {
    const user = '0x0000000000000000000000000000000000000002';
    const collateralAsset = '0x0000000000000000000000000000000000000003';
    const debtAsset = '0x0000000000000000000000000000000000000004';
    const collateralAmount = '2000000000000000000';
    const debtRepayAmount = '1900000000000000000';
    const permit = {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    const useEthPath = true;
    const debtRateMode = InterestRate.None;

    const provider: providers.Provider = new providers.JsonRpcProvider();
    jest
      .spyOn(provider, 'getGasPrice')
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

    const repayInstance = new RepayWithCollateralAdapterService(
      provider,
      repayWithCollateralAddress,
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Exepcts the tx object to be returned if all params passed with useEthPath true and rate mode none', async () => {
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permit,
        useEthPath,
      });
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(repayWithCollateralAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          '(uint256,uint256,uint8,bytes32,bytes32)',
          'bool',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5][0]).toEqual(BigNumber.from(permit.amount));
      expect(decoded[5][1]).toEqual(BigNumber.from(permit.deadline));
      expect(decoded[5][2]).toEqual(permit.v);
      expect(decoded[5][3]).toEqual(permit.r);
      expect(decoded[5][4]).toEqual(permit.s);
      expect(decoded[6]).toEqual(true);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepcts the tx object to be returned if all params passed with useEthPath true and rate mode stable', async () => {
      const debtRateMode = InterestRate.Stable;
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permit,
        useEthPath,
      });
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(repayWithCollateralAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          '(uint256,uint256,uint8,bytes32,bytes32)',
          'bool',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(1));
      expect(decoded[5][0]).toEqual(BigNumber.from(permit.amount));
      expect(decoded[5][1]).toEqual(BigNumber.from(permit.deadline));
      expect(decoded[5][2]).toEqual(permit.v);
      expect(decoded[5][3]).toEqual(permit.r);
      expect(decoded[5][4]).toEqual(permit.s);
      expect(decoded[6]).toEqual(true);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepcts the tx object to be returned if all params passed with useEthPath true and rate mode variable', async () => {
      const debtRateMode = InterestRate.Variable;
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permit,
        useEthPath,
      });
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(repayWithCollateralAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          '(uint256,uint256,uint8,bytes32,bytes32)',
          'bool',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5][0]).toEqual(BigNumber.from(permit.amount));
      expect(decoded[5][1]).toEqual(BigNumber.from(permit.deadline));
      expect(decoded[5][2]).toEqual(permit.v);
      expect(decoded[5][3]).toEqual(permit.r);
      expect(decoded[5][4]).toEqual(permit.s);
      expect(decoded[6]).toEqual(true);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object to be returned if all params passed with useEthPath false', async () => {
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permit,
      });
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(repayWithCollateralAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          '(uint256,uint256,uint8,bytes32,bytes32)',
          'bool',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5][0]).toEqual(BigNumber.from(permit.amount));
      expect(decoded[5][1]).toEqual(BigNumber.from(permit.deadline));
      expect(decoded[5][2]).toEqual(permit.v);
      expect(decoded[5][3]).toEqual(permit.r);
      expect(decoded[5][4]).toEqual(permit.s);
      expect(decoded[6]).toEqual(false);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects tx object gas to be the recommended one when passing txs for approvals', async () => {
      const txObj = repayInstance.swapAndRepay(
        {
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        },
        [
          {
            txType: eEthereumTxType.ERC20_APPROVAL,
            tx: async () => ({}),
            gas: async () => ({
              gasLimit: '1',
              gasPrice: '1',
            }),
          },
        ],
      );
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(repayWithCollateralAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          '(uint256,uint256,uint8,bytes32,bytes32)',
          'bool',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5][0]).toEqual(BigNumber.from(permit.amount));
      expect(decoded[5][1]).toEqual(BigNumber.from(permit.deadline));
      expect(decoded[5][2]).toEqual(permit.v);
      expect(decoded[5][3]).toEqual(permit.r);
      expect(decoded[5][4]).toEqual(permit.s);
      expect(decoded[6]).toEqual(true);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('700000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when repayWithCollateralAddress not passed', () => {
      const repayInstance = new RepayWithCollateralAdapterService(provider);
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permit,
        useEthPath,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail when user not address', () => {
      const user = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail when collateralAsset not address', () => {
      const collateralAsset = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(
        `Address: ${collateralAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when debtAsset not address', () => {
      const debtAsset = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Address: ${debtAsset} is not a valid ethereum Address`);
    });
    it('Expects to fail when collateralAmount not positive', () => {
      const collateralAmount = '0';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Amount: ${collateralAmount} needs to be greater than 0`);
    });
    it('Expects to fail when collateralAmount not a number', () => {
      const collateralAmount = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Amount: ${collateralAmount} needs to be greater than 0`);
    });
    it('Expects to fail when debtRepayAmount not positive', () => {
      const debtRepayAmount = '0';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Amount: ${debtRepayAmount} needs to be greater than 0`);
    });
    it('Expects to fail when debtRepayAmount not a number', () => {
      const debtRepayAmount = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permit,
          useEthPath,
        }),
      ).toThrowError(`Amount: ${debtRepayAmount} needs to be greater than 0`);
    });
  });
});
