/* eslint-disable @typescript-eslint/require-await */
import { providers } from 'ethers';
import { getUserPermissionsResponseMock } from './_mocks';
import { PERMISSION } from './types/PermissionManagerTypes';
import { PermissionManager } from './index';

const mockInvalidEthereumAddress = '0x0';
const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

describe('PermissionManager', () => {
  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new PermissionManager({
            permissionManagerAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });
  });

  describe('getHumanizedUserPermissions', () => {
    const instance = new PermissionManager({
      permissionManagerAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    it('should throw an error if the user is not valid', async () => {
      await expect(
        instance.getHumanizedUserPermissions(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should return human readable response', async () => {
      const spy = jest
        .spyOn(instance, 'getUserPermissions')
        .mockImplementation(async () => getUserPermissionsResponseMock);

      const response = await instance.getHumanizedUserPermissions(
        mockValidEthereumAddress,
      );

      expect(response).toStrictEqual([
        PERMISSION.DEPOSITOR,
        PERMISSION.BORROWER,
      ]);

      spy.mockRestore();
    });
  });
});
