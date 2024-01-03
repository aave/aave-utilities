import { BigNumber, providers, constants, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { AaveTokenV3 } from '../governance-v3/typechain/AaveTokenV3';
import { AaveTokenV3__factory } from '../governance-v3/typechain/factories/AaveTokenV3__factory';
import { StakedAaveV3 } from './typechain/IStakedAaveV3';
import { StakedAaveV3__factory } from './typechain/IStakedAaveV3__factory';
import { StakingService } from './index';

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

  const TOKEN_STAKING_ADDRESS = '0x0000000000000000000000000000000000000001';
  const user = '0x0000000000000000000000000000000000000004';
  const onBehalfOf = '0x0000000000000000000000000000000000000005';

  const amount = '123.456';
  const decimals = 18;
  const deadline = '12345678';

  describe('Initialization', () => {
    it('Expects to be initialized with all params', () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      expect(instance instanceof StakingService).toEqual(true);
    });
    it('Expects to be initialized without config', () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      expect(instance instanceof StakingService).toEqual(true);
    });
  });
  describe('signStaking', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the permission string to be returned when all params', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);

      const aaveV3TokenSpy = jest
        .spyOn(AaveTokenV3__factory, 'connect')
        .mockReturnValue({
          functions: {
            eip712Domain: async () =>
              Promise.resolve({
                name: 'mockToken',
                version: '2',
                chainId: BigNumber.from(1),
                verifyingContract: TOKEN_STAKING_ADDRESS,
              }),
          },
        } as unknown as AaveTokenV3);

      const nonce = 1;

      jest
        .spyOn(instance.erc20_2612Service, 'getNonce')
        .mockReturnValue(Promise.resolve(nonce));

      const signature: string = await instance.signStaking(
        user,
        amount,
        deadline,
      );

      expect(spy).toHaveBeenCalled();
      expect(aaveV3TokenSpy).toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { primaryType, domain, message } = await JSON.parse(signature);
      expect(primaryType).toEqual('Permit');
      expect(domain.name).toEqual('mockToken');
      expect(domain.chainId).toEqual(1);

      expect(message.owner).toEqual(user);
      expect(message.spender).toEqual(TOKEN_STAKING_ADDRESS);
      expect(message.nonce).toEqual(nonce);
      expect(message.value).toEqual(valueToWei(amount, decimals));
      expect(message.deadline).toEqual(deadline);
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS not address', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const signature: string = await instance.signStaking(
        user,
        amount,
        deadline,
      );
      expect(signature).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const user = 'asdf';
      await expect(async () =>
        instance.signStaking(user, amount, deadline),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = '0';
      await expect(async () =>
        instance.signStaking(user, amount, deadline),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = 'asdf';
      await expect(async () =>
        instance.signStaking(user, amount, deadline),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects the permission string to be `` when no nonce', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );
      jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);

      jest
        .spyOn(instance.erc20_2612Service, 'getNonce')
        .mockReturnValue(Promise.resolve(null));

      const signature: string = await instance.signStaking(
        user,
        amount,
        deadline,
      );

      expect(signature).toEqual('');
    });
  });
  describe('stakeWithPermit', () => {
    // const message = 'victor washington'
    const signature =
      '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c';

    const { populateTransaction } = StakedAaveV3__factory.connect(
      TOKEN_STAKING_ADDRESS,
      provider,
    );

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object when all params passed', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValue(Promise.resolve(decimals));

      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);

      const stakeTxObj = await instance.stakeWithPermit(
        user,
        amount,
        signature,
        deadline,
      );

      expect(spy).toHaveBeenCalled();
      expect(stakeTxObj.length).toEqual(1);
      expect(stakeTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await stakeTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256', 'uint8', 'bytes32', 'bytes32'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(BigNumber.from(valueToWei(amount, 18)));
      expect(decoded[1]).toEqual(BigNumber.from(deadline));
      expect(decoded[2]).toEqual(28);
      expect(decoded[3]).toEqual(
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e',
      );
      expect(decoded[4]).toEqual(
        '0x47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );

      // gas price
      const gasPrice: GasType | null = await stakeTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const stake = await instance.stakeWithPermit(
        user,
        amount,
        signature,
        deadline,
      );
      expect(stake).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const user = 'asdf';
      await expect(async () =>
        instance.stakeWithPermit(user, amount, signature, deadline),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = '0';
      await expect(async () =>
        instance.stakeWithPermit(user, amount, signature, deadline),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = 'asdf';
      await expect(async () =>
        instance.stakeWithPermit(user, amount, signature, deadline),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('stake', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const { populateTransaction } = StakedAaveV3__factory.connect(
      TOKEN_STAKING_ADDRESS,
      provider,
    );
    it('Expects the tx object when all params passed with no approval needed', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValueOnce(Promise.resolve(true));

      const stakeTxObj = await instance.stake(user, amount, onBehalfOf);

      expect(spy).toHaveBeenCalled();
      expect(stakeTxObj.length).toEqual(1);
      expect(stakeTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await stakeTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(gasLimitRecommendations[ProtocolAction.stake].limit),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(onBehalfOf);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, 18)));

      // gas price
      const gasPrice: GasType | null = await stakeTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.stake].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object when all params passed and no onBehalfOf with approval needed', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValueOnce(Promise.resolve(false));
      const approveSpy = jest
        .spyOn(instance.erc20Service, 'approve')
        .mockImplementationOnce(() => ({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        }));

      const stakeTxObj = await instance.stake(user, amount);

      expect(approveSpy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(stakeTxObj.length).toEqual(2);
      expect(stakeTxObj[1].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await stakeTxObj[1].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(gasLimitRecommendations[ProtocolAction.stake].limit),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, 18)));

      // gas price
      const gasPrice: GasType | null = await stakeTxObj[1].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.stake].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const stake = await instance.stake(user, amount, onBehalfOf);
      expect(stake).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const user = 'asdf';
      await expect(async () =>
        instance.stake(user, amount, onBehalfOf),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when onBehalfOf not eth address', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const onBehalfOf = 'asdf';
      await expect(async () =>
        instance.stake(user, amount, onBehalfOf),
      ).rejects.toThrowError(
        `Address: ${onBehalfOf} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = '0';
      await expect(async () =>
        instance.stake(user, amount, onBehalfOf),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = 'asdf';
      await expect(async () =>
        instance.stake(user, amount, onBehalfOf),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('redeem', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const { populateTransaction } = StakedAaveV3__factory.connect(
      TOKEN_STAKING_ADDRESS,
      provider,
    );
    it('Expects the tx object when all params passed and specific amount', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const redeemTxObj = await instance.redeem(user, amount);

      expect(spy).toHaveBeenCalled();
      expect(redeemTxObj.length).toEqual(1);
      expect(redeemTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await redeemTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, 18)));

      // gas price
      const gasPrice: GasType | null = await redeemTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object when all params passed and -1 amount', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      const amount = '-1';
      const redeemTxObj = await instance.redeem(user, amount);

      expect(spy).toHaveBeenCalled();
      expect(redeemTxObj.length).toEqual(1);
      expect(redeemTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await redeemTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(constants.MaxUint256);

      // gas price
      const gasPrice: GasType | null = await redeemTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const redeem = await instance.redeem(user, amount);
      expect(redeem).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const user = 'asdf';
      await expect(async () =>
        instance.redeem(user, amount),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = '0';
      await expect(async () =>
        instance.redeem(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = 'asdf';
      await expect(async () =>
        instance.redeem(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('claimRewardsAndStake', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const { populateTransaction } = StakedAaveV3__factory.connect(
      TOKEN_STAKING_ADDRESS,
      provider,
    );
    it('Expects the tx object when all params passed and specific amount', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const redeemAndStakeTxObj = await instance.claimRewardsAndStake(
        user,
        amount,
      );
      console.log(redeemAndStakeTxObj);

      expect(spy).toHaveBeenCalled();
      expect(redeemAndStakeTxObj.length).toEqual(1);
      expect(redeemAndStakeTxObj[0].txType).toEqual(
        eEthereumTxType.STAKE_ACTION,
      );

      const tx: transactionType = await redeemAndStakeTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, 18)));

      // gas price
      const gasPrice: GasType | null = await redeemAndStakeTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object when all params passed and -1 amount', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        STAKED_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });

      const amount = '-1';
      const redeemAndStakeTxObj = await instance.claimRewardsAndStake(
        user,
        amount,
      );

      expect(spy).toHaveBeenCalled();
      expect(redeemAndStakeTxObj.length).toEqual(1);
      expect(redeemAndStakeTxObj[0].txType).toEqual(
        eEthereumTxType.STAKE_ACTION,
      );

      const tx: transactionType = await redeemAndStakeTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(constants.MaxUint256);

      // gas price
      const gasPrice: GasType | null = await redeemAndStakeTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const claimRewardsAndStake = await instance.claimRewardsAndStake(
        user,
        amount,
      );
      expect(claimRewardsAndStake).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const user = 'asdf';
      await expect(async () =>
        instance.claimRewardsAndStake(user, amount),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = '0';
      await expect(async () =>
        instance.claimRewardsAndStake(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS,
      });
      const amount = 'asdf';
      await expect(async () =>
        instance.claimRewardsAndStake(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
  describe('cooldown', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object when all params passed', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const cooldownTxObj = instance.cooldown(user);

      expect(cooldownTxObj.length).toEqual(1);
      expect(cooldownTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await cooldownTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        [],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded).toEqual([]);

      // gas price
      const gasPrice: GasType | null = await cooldownTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const cooldown = instance.cooldown(user);
      expect(cooldown).toEqual([]);
    });
    it('Expects to fail when user not eth address', () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const user = 'asdf';
      expect(() => instance.cooldown(user)).toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
  });
  describe('claimRewards', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const { populateTransaction } = StakedAaveV3__factory.connect(
      TOKEN_STAKING_ADDRESS,
      provider,
    );
    it('Expects the tx object when all params passed with specific amount', async () => {
      const spy = jest.spyOn(StakedAaveV3__factory, 'connect').mockReturnValue({
        populateTransaction,
        REWARD_TOKEN: async () =>
          Promise.resolve('0x0000000000000000000000000000000000000006'),
      } as unknown as StakedAaveV3);
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));

      const claimRewardsTxObj = await instance.claimRewards(user, amount);

      expect(spy).toHaveBeenCalled();
      expect(claimRewardsTxObj.length).toEqual(1);
      expect(claimRewardsTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await claimRewardsTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.claimRewards].limit,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei(amount, 18)));

      // gas price
      const gasPrice: GasType | null = await claimRewardsTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.claimRewards].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object when all params passed with -1 amount', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });

      const amount = '-1';
      const claimRewardsTxObj = await instance.claimRewards(user, amount);

      expect(claimRewardsTxObj.length).toEqual(1);
      expect(claimRewardsTxObj[0].txType).toEqual(eEthereumTxType.STAKE_ACTION);

      const tx: transactionType = await claimRewardsTxObj[0].tx();
      expect(tx.to).toEqual(TOKEN_STAKING_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.claimRewards].limit,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(constants.MaxUint256);

      // gas price
      const gasPrice: GasType | null = await claimRewardsTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.claimRewards].limit,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when not initialized with TOKEN_STAKING_ADDRESS', async () => {
      const instance = new StakingService(provider, {
        TOKEN_STAKING_ADDRESS: 'asdf',
      });
      const claimRewards = instance.claimRewards(user, amount);
      expect(claimRewards).toEqual([]);
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const user = 'asdf';
      await expect(async () =>
        instance.claimRewards(user, amount),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = '0';
      await expect(async () =>
        instance.claimRewards(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new StakingService(provider, { TOKEN_STAKING_ADDRESS });
      const amount = 'asdf';
      await expect(async () =>
        instance.claimRewards(user, amount),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
});
