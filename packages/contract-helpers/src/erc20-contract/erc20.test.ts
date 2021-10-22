import { BigNumber, constants, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  GasType,
  transactionType,
} from '../commons/types';
import { ERC20Service, IERC20ServiceInterface } from '.';

jest.mock('../commons/BaseService');

// jest.mock('./typechain/IERC20Detailed__factory', () => {
//   return {
//     connect: () => ({
//       allowance: async () => Promise.resolve(BigNumber.from(1)),
//     }),
//   };
// });

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

// jest.mock('../commons/BaseService', () => {
//   return function () {
//     return {
//       getContractInstance: () => ({
//         allowance: async () => Promise.resolve(BigNumber.from(1)),
//       }),
//     };
//   };
// });

describe('ERC20Service', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  describe('Initialize', () => {
    it('Expects to be initialized correctly', () => {
      const instance: IERC20ServiceInterface = new ERC20Service(provider);
      expect(instance instanceof ERC20Service).toEqual(true);
    });
  });
  describe('approve', () => {
    const erc20Service: IERC20ServiceInterface = new ERC20Service(provider);
    const user = '0x0000000000000000000000000000000000000001';
    const token = '0x0000000000000000000000000000000000000002';
    const spender = '0x0000000000000000000000000000000000000003';
    const amount = '1000000000000000000';

    it('Expects to get the approval txObj with correct params', async () => {
      const txObj: EthereumTransactionTypeExtended = erc20Service.approve({
        user,
        token,
        spender,
        amount,
      });

      expect(txObj.txType).toEqual(eEthereumTxType.ERC20_APPROVAL);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(token);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(spender);
      expect(decoded[1]).toEqual(BigNumber.from(amount));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when user is not address', () => {
      const user = 'asdf';
      expect(() =>
        erc20Service.approve({
          user,
          token,
          spender,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when token is not address', () => {
      const token = 'asdf';
      expect(() =>
        erc20Service.approve({
          user,
          token,
          spender,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${token} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when spender is not address', () => {
      const spender = 'asdf';
      expect(() =>
        erc20Service.approve({
          user,
          token,
          spender,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${spender} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when amount is not positive > 0', () => {
      const amount = '0';
      expect(() =>
        erc20Service.approve({
          user,
          token,
          spender,
          amount,
        }),
      ).toThrowError(new Error(`Amount: ${amount} needs to be greater than 0`));
    });
    it('Expects to fail when amount is not a number', () => {
      const amount = 'asdf';
      expect(() =>
        erc20Service.approve({
          user,
          token,
          spender,
          amount,
        }),
      ).toThrowError(new Error(`Amount: ${amount} needs to be greater than 0`));
    });
  });
  describe('isApproved', () => {
    const erc20Service: IERC20ServiceInterface = new ERC20Service(provider);
    const user = '0x0000000000000000000000000000000000000001';
    const token = '0x0000000000000000000000000000000000000002';
    const spender = '0x0000000000000000000000000000000000000003';
    const amount = '123.3';

    // mock erc20 service decimalsOf method
    const decimalsSpy = jest
      .spyOn(erc20Service, 'decimalsOf')
      .mockImplementation(async () => Promise.resolve(6));

    it('Expects to be approved with correct params', async () => {
      (BaseService.prototype.getContractInstance = jest.fn()).mockReturnValue({
        allowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
      });
      const isApproved: boolean = await erc20Service.isApproved({
        user,
        token,
        spender,
        amount,
      });
      expect(decimalsSpy).toHaveBeenCalled();
      expect(isApproved).toEqual(true);
    });
    it('Expects to not be approved with correct params', async () => {
      (BaseService.prototype.getContractInstance = jest.fn()).mockReturnValue({
        allowance: async () => Promise.resolve(BigNumber.from('100000')),
      });
      const isApproved: boolean = await erc20Service.isApproved({
        user,
        token,
        spender,
        amount,
      });
      expect(decimalsSpy).toHaveBeenCalled();
      expect(isApproved).toEqual(false);
    });

    it('Expects to get the approval txObj with correct params and -1 amount and max allowance', async () => {
      (BaseService.prototype.getContractInstance = jest.fn()).mockReturnValue({
        allowance: async () => Promise.resolve(constants.MaxUint256),
      });
      const amount = '-1';
      const isApproved: boolean = await erc20Service.isApproved({
        user,
        token,
        spender,
        amount,
      });
      expect(decimalsSpy).toHaveBeenCalled();
      expect(isApproved).toEqual(true);
    });
    it('Expects to fail when user is not address', async () => {
      const user = 'asdf';
      await expect(async () =>
        erc20Service.isApproved({
          user,
          token,
          spender,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when token is not address', async () => {
      const token = 'asdf';
      await expect(async () =>
        erc20Service.isApproved({
          user,
          token,
          spender,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${token} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when spender is not address', async () => {
      const spender = 'asdf';
      await expect(async () =>
        erc20Service.isApproved({
          user,
          token,
          spender,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${spender} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when amount is not positive > 0 or -1', async () => {
      const amount = '0';
      await expect(async () =>
        erc20Service.isApproved({
          user,
          token,
          spender,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Amount: ${amount} needs to be greater than 0 or -1`),
      );
    });
    it('Expects to fail when amount is not number', async () => {
      const amount = 'asdf';
      await expect(async () =>
        erc20Service.isApproved({
          user,
          token,
          spender,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Amount: ${amount} needs to be greater than 0 or -1`),
      );
    });
  });
});
