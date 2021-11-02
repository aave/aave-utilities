import { BigNumber, providers, utils } from 'ethers';
import { StakingService } from './index';
import { IStakedToken } from './typechain/IStakedToken';
import { IStakedToken__factory } from './typechain/IStakedToken__factory';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('StakingService', () => {
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

  const TOKEN_STAKING = '0x0000000000000000000000000000000000000001';
  const STAKING_REWARD_TOKEN = '0x0000000000000000000000000000000000000002';
  const STAKING_HELPER = '0x0000000000000000000000000000000000000003';
  const user = '0x0000000000000000000000000000000000000004';
  // const onBehalfOf = '0x0000000000000000000000000000000000000005';

  const amount = '123.456';
  const nonce = '1';

  const config = {
    TOKEN_STAKING,
    STAKING_REWARD_TOKEN,
    STAKING_HELPER,
  };

  describe('Initialization', () => {
    it('Expects to be initialized with all params', () => {
      const instance = new StakingService(provider, config);
      expect(instance instanceof StakingService).toEqual(true);
    });
    it('Expects to be initialized without config', () => {
      const instance = new StakingService(provider);
      expect(instance instanceof StakingService).toEqual(true);
    });
  });
  describe('signStaking', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the permission string to be returned when all params', async () => {
      const instance = new StakingService(provider, config);

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals: 18,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );
      const spy = jest.spyOn(IStakedToken__factory, 'connect').mockReturnValue({
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as IStakedToken);

      const signature = await instance.signStaking(user, amount, nonce);
      const signatureParsed = utils.splitSignature(signature);

      expect(spy).toHaveBeenCalled();

      expect(signatureParsed.v).toEqual('');
      expect(signatureParsed.r).toEqual('');
      expect(signatureParsed.s).toEqual('');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING', async () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', async () => {});
    it('Expects to fail when not initialized with STAKING_HELPER', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
    it('Expects to fail when nonce not positive or 0', async () => {});
    it('Expects to fail when nonce not number', async () => {});
  });
  describe('stakeWithPermit', () => {
    it('Expects the tx object when all params passed', async () => {});
    it('Expects to fail when not initialized with TOKEN_STAKING', async () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', async () => {});
    it('Expects to fail when not initialized with STAKING_HELPER', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('stake', () => {
    it('Expects the tx object when all params passed with no approval needed', async () => {});
    it('Expects the tx object when all params passed and no onBehalfOf with approval needed', async () => {});
    it('Expects to fail when not initialized with TOKEN_STAKING', async () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when onBehalfOf not eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('redeem', () => {
    it('Expects the tx object when all params passed and specific amount', async () => {});
    it('Expects the tx object when all params passed and -1 amount', async () => {});
    it('Expects to fail when not initialized with TOKEN_STAKING', async () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
  describe('cooldown', () => {
    it('Expects the tx object when all params passed', () => {});
    it('Expects to fail when not initialized with TOKEN_STAKING', () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', () => {});
    it('Expects to fail when user not eth address', () => {});
  });
  describe('claimRewards', () => {
    it('Expects the tx object when all params passed with specific amount', async () => {});
    it('Expects the tx object when all params passed with -1 amount', async () => {});
    it('Expects to fail when not initialized with TOKEN_STAKING', async () => {});
    it('Expects to fail when not initialized with STAKING_REWARD_TOKEN', async () => {});
    it('Expects to fail when user not eth address', async () => {});
    it('Expects to fail when amount not positive', async () => {});
    it('Expects to fail when amount not number', async () => {});
  });
});
