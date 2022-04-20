import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  transactionType,
} from '../commons/types';
import { ParaswapRepayWithCollateral } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('ParaswapRepayWithCollateralAdapterService', () => {
  const repayWithCollateralAddress =
    '0x0000000000000000000000000000000000000001';

  describe('Initialize', () => {
    const provider = new providers.JsonRpcProvider();
    it('Expects to initialize the service with all params', () => {
      expect(
        () =>
          new ParaswapRepayWithCollateral(provider, repayWithCollateralAddress),
      ).not.toThrow();
    });
    it('Expects to initialize the service without repayWithCollateralAddress', () => {
      expect(() => new ParaswapRepayWithCollateral(provider)).not.toThrow();
    });
  });

  describe('swapAndRepay', () => {
    const user = '0x0000000000000000000000000000000000000002';
    const collateralAsset = '0x0000000000000000000000000000000000000003';
    const debtAsset = '0x0000000000000000000000000000000000000004';
    const collateralAmount = '2000000000000000000';
    const debtRepayAmount = '1900000000000000000';
    const swapAndRepayCallData =
      '0x935fb84b0000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001e483c86fa843f6c2000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000180000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee5700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000116446c67b6d00000000000000000000000000000000000000000000000000000000000000200000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001dfec636122d1008df00000000000000000000000000000000000000000000001e4c566f818d31d01300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000006161766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001120000000000000000000000000000000000000000000000000000000006177abb9ae2ba6c0362c11ec8f12233bf85851b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000015180000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae90000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000108e47a6846afd000000000000000000000000000000000000000000000000000000000000099433f80000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb93d1d355dba3f70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c558d406f7449cc936da0231093b069fcb8a42e3a2f0f78f0497515f8d795a29c3a57485920bb65c42c9f5884af63388d493b5cd0bcd2a6eed4fff7173982f4f800000000000000000000000000000000000000000000000000000000000011f80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000420000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000011abcf02276ffa00000000000000000000000000000000000000000000000000000000000082b007c000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001bc072f450f48f66263bd53e801840fbf545c7aa5aac969d568f87eb830b66f36907cba9fd12582a9a96f23d1396da6c94d46fa4bc0ab851972246cd117659949f0000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000386598f16ac87200000000000000000000000000000000000000000000000000046a1698a248c022a0000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb902d4eee4d7c128000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c41623d640c08c3543660e464261260aed59bfba57c22b00326533525bd011953350326cee2a506e6daf1d0d8780eca139ec48cab2280c6e0bf1a1efe72b0ad880000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff0000000000000000000000000000000000000000000000000000000000001d4c00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000a91c3e5350e240000000000000000000000000000000000000000000000000000d41a7b6e826d0000000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001b842ca8317744091cfd12b2d2e9de4c17618cf2e19d5f0eecb68e3691b078542307aae0aeff4ae756ca20d0ec1dff2ec0a6cfdc595dd3a43d6b8a76f630c4b2f9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const permitParams = {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    const augustus = '0x0000000000000000000000000000000000000005';

    const paraswapCalldata = utils.defaultAbiCoder.encode(
      ['bytes', 'address'],
      [swapAndRepayCallData, augustus],
    );

    const debtRateMode = InterestRate.None;
    const repayAll = true;

    const provider: providers.Provider = new providers.JsonRpcProvider();
    jest
      .spyOn(provider, 'getGasPrice')
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

    const repayInstance = new ParaswapRepayWithCollateral(
      provider,
      repayWithCollateralAddress,
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Exepcts the tx object to be returned if all params passed with rate mode none', async () => {
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permitParams,
        swapAndRepayCallData,
        repayAll,
        augustus,
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
          'uint256',
          'bytes',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5]).toEqual(BigNumber.from(36));
      expect(decoded[6]).toEqual(paraswapCalldata);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepcts the tx object to be returned if all params passed with repay all false', async () => {
      const repayAll = false;
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permitParams,
        swapAndRepayCallData,
        repayAll,
        augustus,
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
          'uint256',
          'bytes',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5]).toEqual(BigNumber.from(0));
      expect(decoded[6]).toEqual(paraswapCalldata);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepcts the tx object to be returned if all params passed with rate mode stable', async () => {
      const debtRateMode = InterestRate.Stable;
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permitParams,
        swapAndRepayCallData,
        repayAll,
        augustus,
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
          'uint256',
          'bytes',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(1));
      expect(decoded[5]).toEqual(BigNumber.from(36));
      expect(decoded[6]).toEqual(paraswapCalldata);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepcts the tx object to be returned if all params passed with rate mode variable', async () => {
      const debtRateMode = InterestRate.Variable;
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permitParams,
        swapAndRepayCallData,
        repayAll,
        augustus,
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
          'uint256',
          'bytes',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5]).toEqual(BigNumber.from(36));
      expect(decoded[6]).toEqual(paraswapCalldata);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          'uint256',
          'bytes',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(collateralAsset);
      expect(decoded[1]).toEqual(debtAsset);
      expect(decoded[2]).toEqual(BigNumber.from(collateralAmount));
      expect(decoded[3]).toEqual(BigNumber.from(debtRepayAmount));
      expect(decoded[4]).toEqual(BigNumber.from(2));
      expect(decoded[5]).toEqual(BigNumber.from(36));
      expect(decoded[6]).toEqual(paraswapCalldata);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('700000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when repayWithCollateralAddress not passed', () => {
      const repayInstance = new ParaswapRepayWithCollateral(provider);
      const txObj = repayInstance.swapAndRepay({
        user,
        collateralAsset,
        debtAsset,
        collateralAmount,
        debtRepayAmount,
        debtRateMode,
        permitParams,
        swapAndRepayCallData,
        repayAll,
        augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
        }),
      ).toThrowError(
        `Address: ${collateralAsset} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when augustus not address', () => {
      const augustus = 'asdf';
      expect(() =>
        repayInstance.swapAndRepay({
          user,
          collateralAsset,
          debtAsset,
          collateralAmount,
          debtRepayAmount,
          debtRateMode,
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
        }),
      ).toThrowError(`Address: ${augustus} is not a valid ethereum Address`);
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
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
          permitParams,
          swapAndRepayCallData,
          repayAll,
          augustus,
        }),
      ).toThrowError(`Amount: ${debtRepayAmount} needs to be greater than 0`);
    });
  });
});
