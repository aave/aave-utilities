import { BigNumber, utils } from 'ethers';
import { StkABPTMigratorService } from './index';

const mockAddress = '0x0000000000000000000000000000000000000001';
const mockUser = '0x0000000000000000000000000000000000000002';
const migrateAmount = '100000000000000000000';
const outAmount = BigNumber.from(migrateAmount).mul(100).div(99).toString();

describe('ABPT Migration', () => {
  it('should generate tx data for migration', () => {
    const instance = new StkABPTMigratorService(mockAddress);
    const tx = instance.migrate(mockUser, migrateAmount, ['0', '0'], outAmount);

    const decoded = utils.defaultAbiCoder.decode(
      ['uint256', 'uint256[]', 'uint256'],
      utils.hexDataSlice(tx.data ?? '', 4),
    );

    expect(decoded[0]).toEqual(BigNumber.from(migrateAmount));
    expect(decoded[1][0]).toEqual(BigNumber.from('0'));
    expect(decoded[1][1]).toEqual(BigNumber.from('0'));
    expect(decoded[2]).toEqual(BigNumber.from(outAmount));
  });

  it('should generate tx data for migration with permit', () => {
    const instance = new StkABPTMigratorService(mockAddress);
    const signature =
      '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';
    const deadline = '1234567890';

    const tx = instance.migrateWithPermit({
      user: mockUser,
      amount: migrateAmount,
      tokenOutAmountsMin: ['0', '0'],
      poolOutAmountMin: outAmount,
      deadline,
      signature,
    });

    const decoded = utils.defaultAbiCoder.decode(
      [
        'uint256',
        'uint256',
        'uint8',
        'bytes32',
        'bytes32',
        'uint256[]',
        'uint256',
      ],
      utils.hexDataSlice(tx.data ?? '', 4),
    );

    expect(decoded[0]).toEqual(BigNumber.from(migrateAmount));
    expect(decoded[1]).toEqual(BigNumber.from(deadline));
    expect(decoded[2]).toEqual(28);
    expect(decoded[3]).toEqual(
      '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e',
    );
    expect(decoded[4]).toEqual(
      '0x47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
    );
    expect(decoded[5][0]).toEqual(BigNumber.from('0'));
    expect(decoded[5][1]).toEqual(BigNumber.from('0'));
    expect(decoded[6]).toEqual(BigNumber.from(outAmount));
  });
});
