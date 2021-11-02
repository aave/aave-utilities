describe('StakingService', () => {
  describe('Initialization', () => {
    it('Expects to be initialized with all params', () => {});
    it('Expects to be initialized without config', () => {});
  });
  describe('signStaking', () => {
    it('Expects the permission string to be returned when all params', async () => {});
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
