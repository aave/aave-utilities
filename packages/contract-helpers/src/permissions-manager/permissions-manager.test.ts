import { BigNumber, providers } from 'ethers';
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

    const mock = jest.fn();
    // @ts-expect-error readonly
    instance._contract = {
      getUserPermissions: mock,
    };

    it('should throw an error if the user is not valid', async () => {
      await expect(
        instance.getHumanizedUserPermissions(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw an error if the permission is not known', async () => {
      mock.mockResolvedValueOnce({
        0: [BigNumber.from(5), ...getUserPermissionsResponseMock[0]],
        1: getUserPermissionsResponseMock[1],
      });
      await expect(
        instance.getHumanizedUserPermissions(mockValidEthereumAddress),
      ).rejects.toThrow('Error parsing permission');
    });

    it('should return human readable response', async () => {
      mock.mockResolvedValueOnce(getUserPermissionsResponseMock);

      const response = await instance.getHumanizedUserPermissions(
        mockValidEthereumAddress,
      );

      expect(response).toStrictEqual([
        PERMISSION.DEPOSITOR,
        PERMISSION.BORROWER,
      ]);
    });
  });
});
