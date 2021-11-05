import { BigNumber, providers } from 'ethers';
import { IGovernancePowerDelegationToken } from './typechain/IGovernancePowerDelegationToken';
import { IGovernancePowerDelegationToken__factory } from './typechain/IGovernancePowerDelegationToken__factory';
import { GovernancePowerDelegationTokenService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('GovernancePowerDelegationService', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  jest.spyOn(provider, 'getNetwork').mockImplementation(async () =>
    Promise.resolve({
      name: 'homestead',
      chainId: 1,
    }),
  );

  const AAVE = '0x000000000000000000000000000000000000000e';
  jest.spyOn(provider, 'resolveName').mockImplementation(async name => {
    if (name === 'aave.eth') return Promise.resolve(AAVE);
    return '';
  });
  const NONCE = '0x000000000000000000000000000000000000000f';
  const GOVERNANCE_TOKEN = '0x0000000000000000000000000000000000000003';
  const user = '0x0000000000000000000000000000000000000004';
  const delegatee = '0x0000000000000000000000000000000000000005';
  const signature =
    '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';

  const { populateTransaction } =
    IGovernancePowerDelegationToken__factory.connect(
      GOVERNANCE_TOKEN,
      provider,
    );

  const service = new GovernancePowerDelegationTokenService(provider);

  jest
    .spyOn(IGovernancePowerDelegationToken__factory, 'connect')
    .mockReturnValue({
      populateTransaction,
      getDelegateeByTyp: async () => Promise.resolve('0'),
      getPowerAtBlock: async () => Promise.resolve('0'),
      getDelegateeByType: async () => Promise.resolve('0'),
      getPowerCurrent: async () => Promise.resolve('0'),
      _nonces: async () => Promise.resolve(NONCE),
    } as unknown as IGovernancePowerDelegationToken);

  describe('delegate', () => {
    it('should populate correct tx', async () => {
      const txs = await service.delegate({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
      });
      expect(txs.length).toBe(1);
      const result = await txs[0].tx();
      expect(result.from).toBe(user);
      expect(result.to).toBe(GOVERNANCE_TOKEN);
    });

    it('should properly resolve ens', async () => {
      const txs = await service.delegate({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegatee: 'aave.eth',
      });
      expect(txs.length).toBe(1);
      const result = await txs[0].tx();
      // ens should be resolved which means the address will appear int he data payloads
      expect(result.data).toContain(AAVE.replace('0x', ''));
    });

    it('should error on invalid ens', async () => {
      await expect(async () =>
        service.delegate({
          user,
          governanceToken: GOVERNANCE_TOKEN,
          delegatee: 'bla.eth',
        }),
      ).rejects.toThrowError(`Address: bla.eth is not a valid ENS address`);
    });
    it('should error on malformed ens', async () => {
      await expect(async () =>
        service.delegate({
          user,
          governanceToken: GOVERNANCE_TOKEN,
          delegatee: 'aave',
        }),
      ).rejects.toThrowError(
        `Address aave is not valid ENS format or a valid ethereum Addres`,
      );
    });
  });

  describe('delegateByType', () => {
    it('should populate correct tx', async () => {
      const txs = await service.delegateByType({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
        delegationType: '10',
      });
      expect(txs.length).toBe(1);
      const result = await txs[0].tx();
      expect(result.from).toBe(user);
      expect(result.to).toBe(GOVERNANCE_TOKEN);
    });
  });

  describe('delegateBySig', () => {
    it('should populate correct tx', async () => {
      const txs = await service.delegateBySig({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
        expiry: '10',
        signature,
      });
      expect(txs.length).toBe(1);
      const result = await txs[0].tx();
      expect(result.from).toBe(user);
      expect(result.to).toBe(GOVERNANCE_TOKEN);
    });
  });

  describe('delegateByTypeBySig', () => {
    it('should populate correct tx', async () => {
      const txs = await service.delegateByTypeBySig({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
        expiry: '10',
        signature,
        delegationType: '10',
      });
      expect(txs.length).toBe(1);
      const result = await txs[0].tx();
      expect(result.from).toBe(user);
      expect(result.to).toBe(GOVERNANCE_TOKEN);
    });
  });

  describe('prepareDelegateSignature', () => {
    it('should populate correct signature', async () => {
      const txs = await service.prepareDelegateSignature({
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
        expiry: '10',
        governanceTokenName: 'stkAave',
        nonce: '0',
      });
      expect(JSON.parse(txs).domain.verifyingContract).toBe(GOVERNANCE_TOKEN);
    });
  });

  describe('prepareDelegateByTypeSignature', () => {
    it('should populate correct signature', async () => {
      const txs = await service.prepareDelegateByTypeSignature({
        governanceToken: GOVERNANCE_TOKEN,
        delegatee,
        expiry: '10',
        governanceTokenName: 'stkAave',
        nonce: '0',
        type: '10',
      });
      expect(JSON.parse(txs).domain.verifyingContract).toBe(GOVERNANCE_TOKEN);
    });
  });

  describe('getDelegateeByType', () => {
    it('should populate correct tx', async () => {
      const delegatee = await service.getDelegateeByType({
        governanceToken: GOVERNANCE_TOKEN,
        delegationType: '10',
        delegator: user,
      });
      expect(delegatee).toBe('0');
    });
  });

  describe('getPowerCurrent', () => {
    it('should populate correct tx', async () => {
      const power = await service.getPowerCurrent({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        delegationType: '10',
      });
      expect(power).toBe('0');
    });
  });

  describe('getPowerAtBlock', () => {
    it('should populate correct tx', async () => {
      const power = await service.getPowerAtBlock({
        user,
        governanceToken: GOVERNANCE_TOKEN,
        blockNumber: '100',
        delegationType: '10',
      });
      expect(power).toBe('0');
    });
  });

  describe('getNonce', () => {
    it('should populate correct tx', async () => {
      const nonce = await service.getNonce({
        user,
        governanceToken: GOVERNANCE_TOKEN,
      });
      expect(nonce).toBe(NONCE);
    });
  });
});
