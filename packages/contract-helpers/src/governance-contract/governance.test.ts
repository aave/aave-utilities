import { BigNumber, providers } from 'ethers';
import { GovernanceService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('GovernanceService', () => {
  const provider = new providers.JsonRpcProvider();
  const governanceAddress = '0x0000000000000000000000000000000000000001';
  const governanceHelperAddress = '0x0000000000000000000000000000000000000002';

  describe('Initialization', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to initialize with all params', () => {});
    it('Expects to initialize without helper address', () => {});
  });
  describe('submitVote', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object when passing all params', () => {});
    it('Expects to fail when gov address not eth address', () => {});
    it('Expects to fail when user not eht address', () => {});
    it('Expects to fail when proposalId not positive or 0', () => {});
  });
  describe('getProposals', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects a proposal parsed if all params passed correctly', async () => {});
    it('Expects to fail if gov address not eth address', async () => {});
    it('Expects to fail if gov helper not eth address', async () => {});
  });
  describe('getVotingPowerAt', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to get voting power at block', async () => {});
    it('Expects to fail if gov address not eth address', async () => {});
    it('Expects to fail when user not eth address', async () => {});
  });
  describe('getTokensPower', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects token power obj for each token asked', async () => {});
    it('Expects to fail if gov address not eth address', async () => {});
    it('Expects to fail if gov helper not eth address', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when tokens are not eth address', async () => {});
  });
  describe('getVoteOnProposal', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to get vote info for proposalId', async () => {});
    it('Expects to fail if gov address not eth address', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when proposalId not positive or 0', async () => {});
  });
});
