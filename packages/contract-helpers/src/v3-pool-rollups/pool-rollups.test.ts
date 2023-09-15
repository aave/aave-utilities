import { BigNumber, constants, providers, utils } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  DEFAULT_NULL_VALUE_ON_TX,
  gasLimitRecommendations,
} from '../commons/utils';
// @ts-expect-error TODO: take a look at why its not loading this typechain but works in others
import { L2Encoder } from './typechain/L2Encoder.d.ts';
import { L2Encoder__factory } from './typechain/L2Encoder__factory';
import { L2Pool, L2PoolConfigType, L2PoolInterface } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('L2Pool', () => {
  const l2PoolAddress = '0x0000000000000000000000000000000000000001';
  const encoderAddress = '0x0000000000000000000000000000000000000002';
  const user = '0x0000000000000000000000000000000000000003';
  const reserve = '0x0000000000000000000000000000000000000004';
  const referralCode = '1';
  const numericRateMode = 1;
  const usageAsCollateral = true;
  const amount = '2000000000000000000';
  const deadline = '0';
  const permitV = 0;
  const permitR =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  const permitS =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  const config: L2PoolConfigType = {
    l2PoolAddress,
    encoderAddress,
  };
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  const encodedArg =
    '0x0000000000000000000000000000000000000000000000000000006d6168616d';

  const encoderSpy = jest.spyOn(L2Encoder__factory, 'connect').mockReturnValue({
    encodeSupplyParams: async () => Promise.resolve(encodedArg),
    encodeSupplyWithPermitParams: async () =>
      Promise.resolve([encodedArg, permitR, permitS]),
    encodeWithdrawParams: async () => Promise.resolve(encodedArg),
    encodeBorrowParams: async () => Promise.resolve(encodedArg),
    encodeRepayParams: async () => Promise.resolve(encodedArg),
    encodeRepayWithPermitParams: async () =>
      Promise.resolve([encodedArg, permitR, permitS]),
    encodeRepayWithATokensParams: async () => Promise.resolve(encodedArg),
    encodeSwapBorrowRateMode: async () => Promise.resolve(encodedArg),
    encodeSetUserUseReserveAsCollateral: async () =>
      Promise.resolve(encodedArg),
    encodeLiquidationCall: async () =>
      Promise.resolve([encodedArg, encodedArg]),
  } as unknown as L2Encoder);

  describe('Init L2Pool', () => {
    it('Expects to be initialized correctly', () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      expect(instance instanceof L2Pool).toEqual(true);
    });
    it('Expects to be initialized correctly without passing addresses', () => {
      const instance: L2PoolInterface = new L2Pool(provider);
      expect(instance instanceof L2Pool).toEqual(true);
    });
  });

  describe('Generate Tx Data', () => {
    it('Generate supply tx data without encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const txData = instance.generateSupplyTxData({
        user,
        reserve,
        amount,
      });

      const txData2 = instance.generateSupplyTxData({
        user,
        reserve,
        amount,
        onBehalfOf: user,
      });

      const txData3 = instance.generateSupplyTxData({
        user,
        reserve,
        amount,
        referralCode: '0',
      });

      const supplyTxData =
        '0x617ba03700000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000';

      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(supplyTxData);
      expect(txData2.to).toEqual(l2PoolAddress);
      expect(txData2.from).toEqual(user);
      expect(txData2.data).toEqual(supplyTxData);
      expect(txData3.to).toEqual(l2PoolAddress);
      expect(txData3.from).toEqual(user);
      expect(txData3.data).toEqual(supplyTxData);
    });

    it('Generate supply tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      // Result is mocked so inputs don't matter
      const encodedTxData = await encoder.encodeSupplyParams(reserve, 1, '0');

      const txData = instance.generateEncodedSupplyTxData({
        user,
        encodedTxData,
      });

      const encodedSupplyTxData =
        '0xf7a738400000000000000000000000000000000000000000000000000000006d6168616d';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedSupplyTxData);
    });

    it('Generate supplyWithPermit tx data without encoded parameter', () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const decomposedSignature = splitSignature(signature);
      const txData = instance.generateSupplyWithPermitTxData({
        user,
        reserve,
        amount,
        permitV: decomposedSignature.v,
        permitR: decomposedSignature.r,
        permitS: decomposedSignature.s,
        deadline: '1000',
      });

      const txData2 = instance.generateSupplyWithPermitTxData({
        user,
        reserve,
        amount,
        onBehalfOf: user,
        permitV: decomposedSignature.v,
        permitR: decomposedSignature.r,
        permitS: decomposedSignature.s,
        deadline: '1000',
      });

      const txData3 = instance.generateSupplyWithPermitTxData({
        user,
        reserve,
        amount,
        referralCode: '0',
        permitV: decomposedSignature.v,
        permitR: decomposedSignature.r,
        permitS: decomposedSignature.s,
        deadline: '1000',
      });

      const supplyTxData =
        '0x02c205f000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000001bc16d674ec800000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000001c532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(supplyTxData);
      expect(txData2.to).toEqual(l2PoolAddress);
      expect(txData2.from).toEqual(user);
      expect(txData2.data).toEqual(supplyTxData);
      expect(txData3.to).toEqual(l2PoolAddress);
      expect(txData3.from).toEqual(user);
      expect(txData3.data).toEqual(supplyTxData);
    });

    it('Generate supplyWithPermit tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const decomposedSignature = splitSignature(signature);
      expect(instance).toBeDefined();
      expect(encoder).toBeDefined();
      // Result is mocked so inputs don't matter
      const encodedTxData = await encoder.encodeSupplyWithPermitParams(
        reserve,
        1,
        '0',
        '10000',
        decomposedSignature.v,
        decomposedSignature.r,
        decomposedSignature.s,
      );

      expect(encodedTxData).toBeDefined();

      const txData = instance.generateEncodedSupplyWithPermitTxData({
        user,
        encodedTxData: encodedTxData[0],
        signature,
      });

      const encodedSupplyWithPermitTxData =
        '0x680dd47c0000000000000000000000000000000000000000000000000000006d6168616d532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedSupplyWithPermitTxData);
    });
    it('Generate borrow tx data without encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const txData = instance.generateBorrowTxData({
        user,
        reserve,
        amount,
        numericRateMode,
      });

      const txData2 = instance.generateBorrowTxData({
        user,
        reserve,
        amount,
        numericRateMode,
        onBehalfOf: user,
      });

      const txData3 = instance.generateBorrowTxData({
        user,
        reserve,
        amount,
        numericRateMode,
        referralCode: '0',
      });

      const borrowTxData =
        '0xa415bcad00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000001bc16d674ec80000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003';

      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(borrowTxData);
      expect(txData2.to).toEqual(l2PoolAddress);
      expect(txData2.from).toEqual(user);
      expect(txData2.data).toEqual(borrowTxData);
      expect(txData3.to).toEqual(l2PoolAddress);
      expect(txData3.from).toEqual(user);
      expect(txData3.data).toEqual(borrowTxData);
    });

    it('Generate borrow tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      // Result is mocked so inputs don't matter
      const encodedTxData = await encoder.encodeBorrowParams(
        reserve,
        1,
        '1',
        '0',
      );

      const txData = instance.generateEncodedBorrowTxData({
        user,
        encodedTxData,
      });

      const encodedBorrowTxData =
        '0xd5eed8680000000000000000000000000000000000000000000000000000006d6168616d';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedBorrowTxData);
    });

    it('Generate repay tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      const encodedTxData = await encoder.encodeRepayParams(reserve, 1, '0');

      const txData = instance.generateEncodedSupplyTxData({
        user,
        encodedTxData,
      });

      const encodedRepayTxData =
        '0xf7a738400000000000000000000000000000000000000000000000000000006d6168616d';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedRepayTxData);
    });

    it('Generate repayWithATokens tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      const encodedTxData = await encoder.encodeRepayWithATokensParams(
        reserve,
        1,
        '0',
      );

      const txData = instance.generateEncodedRepayWithATokensTxData({
        user,
        encodedTxData,
      });

      const encodedRepayTxData =
        '0xdc7c0bff0000000000000000000000000000000000000000000000000000006d6168616d';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedRepayTxData);
    });

    it('Generate repayWithPermit tx data with encoded parameter', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);

      const encoder = instance.getEncoder();

      const signature =
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
      const decomposedSignature = splitSignature(signature);
      expect(instance).toBeDefined();
      expect(encoder).toBeDefined();

      const encodedTxData = await encoder.encodeRepayWithPermitParams(
        reserve,
        1,
        '0',
        '10000',
        decomposedSignature.v,
        decomposedSignature.r,
        decomposedSignature.s,
      );

      expect(encodedTxData).toBeDefined();

      const txData = instance.generateEncodedRepayWithPermitTxData({
        user,
        encodedTxData: encodedTxData[0],
        signature,
      });

      const encodedRepayWithPermitTxData =
        '0x94b576de0000000000000000000000000000000000000000000000000000006d6168616d532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4';
      expect(txData.to).toEqual(l2PoolAddress);
      expect(txData.from).toEqual(user);
      expect(txData.data).toEqual(encodedRepayWithPermitTxData);
    });
  });
  describe('getEncoder', () => {
    const instance: L2PoolInterface = new L2Pool(provider, config);

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects to return contract if not initialized', () => {
      expect(instance.encoderContract).toEqual(undefined);

      const encoder: L2Encoder = instance.getEncoder();
      expect(encoder).toEqual(instance.encoderContract);
    });
    it('Expects to return contract without reinitalizing if already there', () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      expect(instance.encoderContract).toEqual(undefined);
      const encoder: L2Encoder = instance.getEncoder();
      expect(instance.encoderContract).toEqual(encoder);
      const encoder2: L2Encoder = instance.getEncoder();
      expect(encoder2).toEqual(encoder);
    });
    it('Expects to return undefined when encoder address not correct', () => {
      const instance = new L2Pool(provider);
      const encoder = instance.getEncoder();
      expect(encoder).toEqual(undefined);
    });
  });
  describe('supply', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const supplyTxObj = await instance.supply(
        {
          user,
          reserve,
          amount,
          referralCode,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects tx object with optimized args without referral code', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const supplyTxObj = await instance.supply(
        {
          user,
          reserve,
          amount,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(supplyTxObj.length).toEqual(1);
      const txObj = supplyTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const supplyTxObj = await instance.supply(
        {
          user,
          reserve,
          amount,
          referralCode,
        },
        [],
      );
      expect(supplyTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const supplyTxObj = await instance.supply(
        {
          user,
          reserve,
          amount,
          referralCode,
        },
        [],
      );
      expect(supplyTxObj).toEqual([]);
    });
  });
  describe('supplyWithPermit', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const supplyWithPermitTxObj = await instance.supplyWithPermit(
        {
          user,
          reserve,
          amount,
          referralCode,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(supplyWithPermitTxObj.length).toEqual(1);
      const txObj = supplyWithPermitTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32', 'bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);
      expect(decoded[1]).toEqual(permitR);
      expect(decoded[2]).toEqual(permitS);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects tx object with optimized args without referralCode', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const supplyWithPermitTxObj = await instance.supplyWithPermit(
        {
          user,
          reserve,
          amount,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(supplyWithPermitTxObj.length).toEqual(1);
      const txObj = supplyWithPermitTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32', 'bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);
      expect(decoded[1]).toEqual(permitR);
      expect(decoded[2]).toEqual(permitS);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const supplyWithPermitTxObj = await instance.supplyWithPermit(
        {
          user,
          reserve,
          amount,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );
      expect(supplyWithPermitTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const supplyWithPermitTxObj = await instance.supplyWithPermit(
        {
          user,
          reserve,
          amount,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );
      expect(supplyWithPermitTxObj).toEqual([]);
    });
    it('Expects to fail when deadline is to big', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
        l2PoolAddress,
      });
      const deadline = constants.MaxUint256.toString();
      await expect(async () =>
        instance.supplyWithPermit(
          {
            user,
            reserve,
            amount,
            deadline,
            permitR,
            permitS,
            permitV,
          },
          [],
        ),
      ).rejects.toThrowError(`Deadline: ${deadline} is bigger than 32 bytes`);
    });
  });
  describe('withdraw', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const withdrawTxObj = await instance.withdraw({
        user,
        reserve,
        amount,
      });

      expect(encoderSpy).toHaveBeenCalled();
      expect(withdrawTxObj.length).toEqual(1);
      const txObj = withdrawTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.withdraw].recommended,
        ),
      );
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.withdraw].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const withdrawTxObj = await instance.withdraw({
        user,
        reserve,
        amount,
      });
      expect(withdrawTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const withdrawTxObj = await instance.withdraw({
        user,
        reserve,
        amount,
      });
      expect(withdrawTxObj).toEqual([]);
    });
  });
  describe('borrow', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const borrowTxObj = await instance.borrow({
        user,
        reserve,
        amount,
        numericRateMode,
        referralCode,
      });

      expect(encoderSpy).toHaveBeenCalled();
      expect(borrowTxObj.length).toEqual(1);
      const txObj = borrowTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects tx object with optimized args without', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const borrowTxObj = await instance.borrow({
        user,
        reserve,
        amount,
        numericRateMode,
      });

      expect(encoderSpy).toHaveBeenCalled();
      expect(borrowTxObj.length).toEqual(1);
      const txObj = borrowTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const borrowTxObj = await instance.borrow({
        user,
        reserve,
        amount,
        numericRateMode,
      });
      expect(borrowTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const borrowTxObj = await instance.borrow({
        user,
        reserve,
        amount,
        numericRateMode,
      });
      expect(borrowTxObj).toEqual([]);
    });
  });
  describe('repay', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const repayTxObj = await instance.repay(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(repayTxObj.length).toEqual(1);
      const txObj = repayTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const repayTxObj = await instance.repay(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );
      expect(repayTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const repayTxObj = await instance.repay(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );
      expect(repayTxObj).toEqual([]);
    });
  });
  describe('repayWithPermit', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const repayWithPermitTxObj = await instance.repayWithPermit(
        {
          user,
          reserve,
          amount,
          numericRateMode,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(repayWithPermitTxObj.length).toEqual(1);
      const txObj = repayWithPermitTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32', 'bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);
      expect(decoded[1]).toEqual(permitR);
      expect(decoded[2]).toEqual(permitS);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const repayWithPermitTxObj = await instance.repayWithPermit(
        {
          user,
          reserve,
          amount,
          numericRateMode,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );
      expect(repayWithPermitTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const repayWithPermitTxObj = await instance.repayWithPermit(
        {
          user,
          reserve,
          amount,
          numericRateMode,
          deadline,
          permitR,
          permitS,
          permitV,
        },
        [],
      );
      expect(repayWithPermitTxObj).toEqual([]);
    });
    it('Expects to fail when deadline is to big', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
        l2PoolAddress,
      });
      const deadline = constants.MaxUint256.toString();
      await expect(async () =>
        instance.repayWithPermit(
          {
            user,
            reserve,
            amount,
            numericRateMode,
            deadline,
            permitR,
            permitS,
            permitV,
          },
          [],
        ),
      ).rejects.toThrowError(`Deadline: ${deadline} is bigger than 32 bytes`);
    });
  });
  describe('repayWithATokens', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const repayWithATokensTxObj = await instance.repayWithATokens(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(repayWithATokensTxObj.length).toEqual(1);
      const txObj = repayWithATokensTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const repayWithATokensTxObj = await instance.repayWithATokens(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );
      expect(repayWithATokensTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const repayWithATokensTxObj = await instance.repayWithATokens(
        {
          user,
          reserve,
          amount,
          numericRateMode,
        },
        [],
      );
      expect(repayWithATokensTxObj).toEqual([]);
    });
  });
  describe('swapBorrowRateMode', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const swapRateTxObj = await instance.swapBorrowRateMode({
        user,
        reserve,
        numericRateMode,
      });

      expect(encoderSpy).toHaveBeenCalled();
      expect(swapRateTxObj.length).toEqual(1);
      const txObj = swapRateTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const swapRateTxObj = await instance.swapBorrowRateMode({
        user,
        reserve,
        numericRateMode,
      });
      expect(swapRateTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const swapRateTxObj = await instance.swapBorrowRateMode({
        user,
        reserve,
        numericRateMode,
      });
      expect(swapRateTxObj).toEqual([]);
    });
  });
  describe('setUserUseReserveAsCollateral', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const setAsCollateralTxObj = await instance.setUserUseReserveAsCollateral(
        {
          user,
          reserve,
          usageAsCollateral,
        },
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(setAsCollateralTxObj.length).toEqual(1);
      const txObj = setAsCollateralTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const setAsCollateralTxObj = await instance.setUserUseReserveAsCollateral(
        {
          user,
          reserve,
          usageAsCollateral,
        },
      );
      expect(setAsCollateralTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const setAsCollateralTxObj = await instance.setUserUseReserveAsCollateral(
        {
          user,
          reserve,
          usageAsCollateral,
        },
      );
      expect(setAsCollateralTxObj).toEqual([]);
    });
  });
  describe('liquidationCall', () => {
    const liquidator = '0x0000000000000000000000000000000000000005';
    const liquidatedUser = '0x0000000000000000000000000000000000000006';
    const debtReserve = '0x0000000000000000000000000000000000000007';
    const collateralReserve = '0x0000000000000000000000000000000000000008';
    const debtToCover = '1000000000000000000';
    const getAToken = true;

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects tx object with optimized args', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const liquidationCallTxObj = await instance.liquidationCall(
        {
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          debtToCover,
          getAToken,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(liquidationCallTxObj.length).toEqual(1);
      const txObj = liquidationCallTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(liquidator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);
      expect(decoded[1]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects tx object with optimized args with getAToken false', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, config);
      const liquidationCallTxObj = await instance.liquidationCall(
        {
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          debtToCover,
        },
        [],
      );

      expect(encoderSpy).toHaveBeenCalled();
      expect(liquidationCallTxObj.length).toEqual(1);
      const txObj = liquidationCallTxObj[0];
      expect(txObj.txType).toEqual(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(l2PoolAddress);
      expect(tx.from).toEqual(liquidator);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        ['bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[0]).toEqual(encodedArg);
      expect(decoded[1]).toEqual(encodedArg);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to error when l2PoolAddress not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        encoderAddress,
      });
      const liquidationCallTxObj = await instance.liquidationCall(
        {
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          debtToCover,
        },
        [],
      );
      expect(liquidationCallTxObj).toEqual([]);
    });
    it('Expects to error out when encoder address not correct', async () => {
      const instance: L2PoolInterface = new L2Pool(provider, {
        l2PoolAddress,
      });
      const liquidationCallTxObj = await instance.liquidationCall(
        {
          liquidator,
          liquidatedUser,
          debtReserve,
          collateralReserve,
          debtToCover,
        },
        [],
      );
      expect(liquidationCallTxObj).toEqual([]);
    });
  });
});
