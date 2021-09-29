/* eslint-disable @typescript-eslint/require-await */
import { providers } from 'ethers';
import { getUserPermissionsResponseMock } from './_mocks';
import { PERMISSION } from './types/PermissionManagerTypes';
import { PermissionManager } from './index';

describe('PermissionManager', () => {
  describe('getHumanizedUserPermissions', () => {
    const mockValidEthereumAddress =
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

    const instance = new PermissionManager({
      permissionManagerAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
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
