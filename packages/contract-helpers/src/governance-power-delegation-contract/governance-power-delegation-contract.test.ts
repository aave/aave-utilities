import { BigNumber, providers } from 'ethers';
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

  const GOVERNANCE_TOKEN = '0x0000000000000000000000000000000000000003';
  const user = '0x0000000000000000000000000000000000000004';
  const delegatee = '0x0000000000000000000000000000000000000005';

  const service = new GovernancePowerDelegationTokenService(provider);

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
  });

  describe('delegateByType', async () => {
    const txs = await service.delegateByType({
      user,
      governanceToken: GOVERNANCE_TOKEN,
      delegatee,
      delegationType: 
    });
    expect(txs.length).toBe(1);
    const result = await txs[0].tx();
    expect(result.from).toBe(user);
    expect(result.to).toBe(GOVERNANCE_TOKEN);
  });

  describe('delegateBySig', () => {});

  describe('delegateByTypeBySig', () => {});

  describe('prepareDelegateSignature', () => {});

  describe('prepareDelegateByTypeSignature', () => {});

  describe('getDelegateeByType', () => {});

  describe('getPowerCurrent', () => {});

  describe('getPowerAtBlock', () => {});

  describe('getNonce', () => {});
});
