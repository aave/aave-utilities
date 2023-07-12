import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  GasType,
  transactionType,
} from '../commons/types';
import {
  LiquiditySwapAdapterService,
  augustusFromAmountOffsetFromCalldata,
} from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('LiquiditySwapAdapterService', () => {
  const swapCollateralAdapterAddress =
    '0x0000000000000000000000000000000000000001';
  describe('Initialization', () => {
    const provider = new providers.JsonRpcProvider();
    it('Expects to initialize with full params', () => {
      expect(
        () =>
          new LiquiditySwapAdapterService(
            provider,
            swapCollateralAdapterAddress,
          ),
      ).not.toThrow();
    });
    it('Expects to initialize without liquiditySwapAdapterAddress', () => {
      expect(() => new LiquiditySwapAdapterService(provider)).not.toThrow();
    });
  });
  describe('augustusFromAmountOffsetFromCalldata', () => {
    it('Expects 100 when Augustus V3 multiSwap', () => {
      const callData = '0xda8567c80000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(100);
    });
    it('Expects 4 when Augustus V4 swapOnUniswap', () => {
      const callData = '0x58b9d1790000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(4);
    });
    it('Expects 68 when Augustus V4 swapOnUniswapFork', () => {
      const callData = '0x0863b7ac0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V4 multiSwap', () => {
      const callData = '0x8f00eccb0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V4 megaSwap', () => {
      const callData = '0xec1d21dd0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });

    it('Expects 4 when Augustus V5 swapOnUniswap', () => {
      const callData = '0x54840d1a0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(4);
    });
    it('Expects 68 when Augustus V5 swapOnUniswapFork', () => {
      const callData = '0xf56610340000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 36 when Augustus V5 swapOnUniswapV2Fork', () => {
      const callData = '0x0b86a4c10000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(36);
    });
    it('Expects 68 when Augustus V5 swapOnZeroXv4', () => {
      const callData = '0x644668050000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 multiSwap', () => {
      const callData = '0xa94e78ef0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 megaSwap', () => {
      const callData = '0x46c67b6d0000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 directUniV3Swap', () => {
      const callData = '0xa6866da90000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 directCurveV2Swap', () => {
      const callData = '0x58f151000000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 directCurveV1Swap', () => {
      const callData = '0x3865bde60000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 directBalancerV2GivenOutSwap', () => {
      const callData = '0x19fc5be00000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects 68 when Augustus V5 directBalancerV2GivenInSwap', () => {
      const callData = '0xb22f4db80000000000otherCallData000000000';
      const offset = augustusFromAmountOffsetFromCalldata(callData);

      expect(offset).toEqual(68);
    });
    it('Expects to fail if non recognizable Augustus function selector', () => {
      const callData = 'bad calldata';
      expect(() => augustusFromAmountOffsetFromCalldata(callData)).toThrowError(
        'Unrecognized function selector for Augustus',
      );
    });
  });
  describe('swapAndDeposit', () => {
    const user = '0x0000000000000000000000000000000000000002';
    const assetToSwapFrom = '0x0000000000000000000000000000000000000003';
    const assetToSwapTo = '0x0000000000000000000000000000000000000004';
    const augustus = '0x0000000000000000000000000000000000000005';
    const amountToSwap = '2000000000000000000';
    const minAmountToReceive = '1900000000000000000';
    const permitParams = {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    const swapCallData =
      '0xda8567c80000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001e483c86fa843f6c2000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000180000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee5700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000116446c67b6d00000000000000000000000000000000000000000000000000000000000000200000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000119027b700000000000000000000000000000000000000000000001dfec636122d1008df00000000000000000000000000000000000000000000001e4c566f818d31d01300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000006161766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001120000000000000000000000000000000000000000000000000000000006177abb9ae2ba6c0362c11ec8f12233bf85851b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000015180000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae90000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000108e47a6846afd000000000000000000000000000000000000000000000000000000000000099433f80000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb93d1d355dba3f70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c558d406f7449cc936da0231093b069fcb8a42e3a2f0f78f0497515f8d795a29c3a57485920bb65c42c9f5884af63388d493b5cd0bcd2a6eed4fff7173982f4f800000000000000000000000000000000000000000000000000000000000011f80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000420000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5990000000000000000000000000000000000000000000000011abcf02276ffa00000000000000000000000000000000000000000000000000000000000082b007c000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001bc072f450f48f66263bd53e801840fbf545c7aa5aac969d568f87eb830b66f36907cba9fd12582a9a96f23d1396da6c94d46fa4bc0ab851972246cd117659949f0000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003a0430bf7cd2633af111ce3204db4b0990857a6f0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000386598f16ac87200000000000000000000000000000000000000000000000000046a1698a248c022a0000000000000000000000000000006daea1723962647b7e189d311d757fb793000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abb902d4eee4d7c128000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001c41623d640c08c3543660e464261260aed59bfba57c22b00326533525bd011953350326cee2a506e6daf1d0d8780eca139ec48cab2280c6e0bf1a1efe72b0ad880000000000000000000000000000000000000000000000000000000000000001000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff0000000000000000000000000000000000000000000000000000000000001d4c00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000007fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000a91c3e5350e240000000000000000000000000000000000000000000000000000d41a7b6e826d0000000000000000000000000000b3c839dbde6b96d37c56ee4f9dad3390d49310aa000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000100cec21fa2a0bdc21f770ec06e885e7c52a18680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006177abd60000000000000000000000000000000000000000000000000000017cbb773bf00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000001b842ca8317744091cfd12b2d2e9de4c17618cf2e19d5f0eecb68e3691b078542307aae0aeff4ae756ca20d0ec1dff2ec0a6cfdc595dd3a43d6b8a76f630c4b2f9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const swapAll = true;

    const provider: providers.Provider = new providers.JsonRpcProvider();
    jest
      .spyOn(provider, 'getGasPrice')
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

    const swapInstance = new LiquiditySwapAdapterService(
      provider,
      swapCollateralAdapterAddress,
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the tx object when sending all correct params with swap all true', async () => {
      const txObj: EthereumTransactionTypeExtended =
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        });

      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(swapCollateralAdapterAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          'bytes',
          'address',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(assetToSwapFrom);
      expect(decoded[1]).toEqual(assetToSwapTo);
      expect(decoded[2]).toEqual(BigNumber.from(amountToSwap));
      expect(decoded[3]).toEqual(BigNumber.from(minAmountToReceive));
      expect(decoded[4]).toEqual(BigNumber.from(100));
      expect(decoded[5]).toEqual(swapCallData);
      expect(decoded[6]).toEqual(augustus);
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
    it('Expects the tx object when sending all correct params with swap all false', async () => {
      const swapAll = false;
      const txObj: EthereumTransactionTypeExtended =
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        });

      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(swapCollateralAdapterAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          'bytes',
          'address',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(assetToSwapFrom);
      expect(decoded[1]).toEqual(assetToSwapTo);
      expect(decoded[2]).toEqual(BigNumber.from(amountToSwap));
      expect(decoded[3]).toEqual(BigNumber.from(minAmountToReceive));
      expect(decoded[4]).toEqual(BigNumber.from(0));
      expect(decoded[5]).toEqual(swapCallData);
      expect(decoded[6]).toEqual(augustus);
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
    it('Expects recommended gas if approval txs', async () => {
      const txObj: EthereumTransactionTypeExtended =
        swapInstance.swapAndDeposit(
          {
            user,
            assetToSwapFrom,
            assetToSwapTo,
            amountToSwap,
            minAmountToReceive,
            permitParams,
            augustus,
            swapCallData,
            swapAll,
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
      expect(tx.to).toEqual(swapCollateralAdapterAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'uint256',
          'bytes',
          'address',
          '(uint256,uint256,uint8,bytes32,bytes32)',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(assetToSwapFrom);
      expect(decoded[1]).toEqual(assetToSwapTo);
      expect(decoded[2]).toEqual(BigNumber.from(amountToSwap));
      expect(decoded[3]).toEqual(BigNumber.from(minAmountToReceive));
      expect(decoded[4]).toEqual(BigNumber.from(100));
      expect(decoded[5]).toEqual(swapCallData);
      expect(decoded[6]).toEqual(augustus);
      expect(decoded[7][0]).toEqual(BigNumber.from(permitParams.amount));
      expect(decoded[7][1]).toEqual(BigNumber.from(permitParams.deadline));
      expect(decoded[7][2]).toEqual(permitParams.v);
      expect(decoded[7][3]).toEqual(permitParams.r);
      expect(decoded[7][4]).toEqual(permitParams.s);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1000000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail if swapCollateralAdapterAddress not provided', () => {
      const swapInstance = new LiquiditySwapAdapterService(provider);
      const txObj = swapInstance.swapAndDeposit({
        user,
        assetToSwapFrom,
        assetToSwapTo,
        amountToSwap,
        minAmountToReceive,
        permitParams,
        augustus,
        swapCallData,
        swapAll,
      });
      expect(txObj).toEqual([]);
    });
    it('Expects to fail if user not address', () => {
      const user = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(`Address: ${user} is not a valid ethereum Address`);
    });
    it('Expects to fail if assetToSwapFrom not address', () => {
      const assetToSwapFrom = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(
        `Address: ${assetToSwapFrom} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if assetToSwapTo not address', () => {
      const assetToSwapTo = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(
        `Address: ${assetToSwapTo} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if augustus not address', () => {
      const augustus = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(`Address: ${augustus} is not a valid ethereum Address`);
    });
    it('Expects to fail if amountToSwap not positive', () => {
      const amountToSwap = '0';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(`Amount: ${amountToSwap} needs to be greater than 0`);
    });
    it('Expects to fail if amountToSwap not number', () => {
      const amountToSwap = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(`Amount: ${amountToSwap} needs to be greater than 0`);
    });
    it('Expects to fail if minAmountToReceive not positive', () => {
      const minAmountToReceive = '0';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(
        `Amount: ${minAmountToReceive} needs to be greater than 0`,
      );
    });
    it('Expects to fail if minAmountToReceive not number', () => {
      const minAmountToReceive = 'asdf';
      expect(() =>
        swapInstance.swapAndDeposit({
          user,
          assetToSwapFrom,
          assetToSwapTo,
          amountToSwap,
          minAmountToReceive,
          permitParams,
          augustus,
          swapCallData,
          swapAll,
        }),
      ).toThrowError(
        `Amount: ${minAmountToReceive} needs to be greater than 0`,
      );
    });
  });
});
