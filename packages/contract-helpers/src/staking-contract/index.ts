import { SignatureLike } from '@ethersproject/bytes';
import { constants, utils, Signature, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { DEFAULT_APPROVE_AMOUNT, valueToWei } from '../commons/utils';
import {
  SignStakingValidator,
  StakingValidator,
} from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20_2612Interface, ERC20_2612Service } from '../erc20-2612';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { AaveTokenV3Service } from '../governance-v3/aave-token-v3';
import { StakedAaveV3 } from './typechain/IStakedAaveV3';
import { StakedAaveV3__factory } from './typechain/IStakedAaveV3__factory';

export interface StakingInterface {
  stakingContractAddress: tEthereumAddress;

  stake: (
    user: tEthereumAddress,
    amount: string,
    onBehalfOf?: tEthereumAddress,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  redeem: (
    user: tEthereumAddress,
    amount: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  cooldown: (user: tEthereumAddress) => EthereumTransactionTypeExtended[];
  claimRewards: (
    user: tEthereumAddress,
    amount: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  signStaking: (
    user: tEthereumAddress,
    amount: string,
    deadline: string,
  ) => Promise<string>;
  stakeWithPermit: (
    user: tEthereumAddress,
    amount: string,
    signature: string,
    deadline: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  claimRewardsAndStake: (
    user: tEthereumAddress,
    amount: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

type StakingServiceConfig = {
  TOKEN_STAKING_ADDRESS: string;
};

export class StakingService
  extends BaseService<StakedAaveV3>
  implements StakingInterface
{
  public readonly stakingContractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  readonly erc20_2612Service: ERC20_2612Interface;

  constructor(
    provider: providers.Provider,
    stakingServiceConfig: StakingServiceConfig,
  ) {
    super(provider, StakedAaveV3__factory);

    this.erc20Service = new ERC20Service(provider);

    this.erc20_2612Service = new ERC20_2612Service(provider);

    this.stakingContractAddress = stakingServiceConfig.TOKEN_STAKING_ADDRESS;
  }

  @SignStakingValidator
  public async signStaking(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveAmount() amount: string,
    deadline: string,
  ): Promise<string> {
    const { getTokenData } = this.erc20Service;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    // eslint-disable-next-line new-cap
    const stakedToken: string = await stakingContract.STAKED_TOKEN();
    const { decimals } = await getTokenData(stakedToken);
    const convertedAmount: string = valueToWei(amount, decimals);
    const { chainId } = await this.provider.getNetwork();

    const aaveTokenV3Service = new AaveTokenV3Service(
      stakedToken,
      this.provider,
    );
    const { name, version } = await aaveTokenV3Service.getEip712Domain();

    const nonce = await this.erc20_2612Service.getNonce({
      token: stakedToken,
      owner: user,
    });

    if (nonce === null) {
      return '';
    }

    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Permit',
      domain: {
        name,
        version,
        chainId,
        verifyingContract: stakedToken,
      },
      message: {
        owner: user,
        spender: this.stakingContractAddress,
        value: convertedAmount,
        nonce,
        deadline,
      },
    };

    return JSON.stringify(typeData);
  }

  @SignStakingValidator
  public async stakeWithPermit(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveAmount() amount: string,
    signature: SignatureLike,
    deadline: string,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { decimalsOf } = this.erc20Service;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    // eslint-disable-next-line new-cap
    const stakedToken: string = await stakingContract.STAKED_TOKEN();
    const stakedTokenDecimals: number = await decimalsOf(stakedToken);
    const convertedAmount: string = valueToWei(amount, stakedTokenDecimals);
    const sig: Signature = utils.splitSignature(signature);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.stakeWithPermit(
          convertedAmount,
          deadline,
          sig.v,
          sig.r,
          sig.s,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.stakeWithPermit,
      ),
    });

    return txs;
  }

  @StakingValidator
  public async stake(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveAmount() amount: string,
    @isEthAddress() onBehalfOf?: tEthereumAddress,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { decimalsOf, isApproved, approve } = this.erc20Service;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    // eslint-disable-next-line new-cap
    const stakedToken: string = await stakingContract.STAKED_TOKEN();
    const stakedTokenDecimals: number = await decimalsOf(stakedToken);
    const convertedAmount: string = valueToWei(amount, stakedTokenDecimals);
    const approved: boolean = await isApproved({
      token: stakedToken,
      user,
      spender: this.stakingContractAddress,
      amount,
    });
    if (!approved) {
      const approveTx = approve({
        user,
        token: stakedToken,
        spender: this.stakingContractAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.stake(
          onBehalfOf ?? user,
          convertedAmount,
        ),
      from: user,
      action: ProtocolAction.stake,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.stake,
      ),
    });

    return txs;
  }

  @StakingValidator
  public async redeem(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveOrMinusOneAmount() amount: string,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let convertedAmount: string;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    if (amount === '-1') {
      convertedAmount = constants.MaxUint256.toString();
    } else {
      const { decimalsOf } = this.erc20Service;

      // eslint-disable-next-line new-cap
      const stakedToken: string = await stakingContract.STAKED_TOKEN();
      const stakedTokenDecimals: number = await decimalsOf(stakedToken);
      convertedAmount = valueToWei(amount, stakedTokenDecimals);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.redeem(user, convertedAmount),
      from: user,
      gasSurplus: 20,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @StakingValidator
  public cooldown(
    @isEthAddress() user: tEthereumAddress,
  ): EthereumTransactionTypeExtended[] {
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => stakingContract.populateTransaction.cooldown(),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @StakingValidator
  public async claimRewards(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveOrMinusOneAmount() amount: string,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let convertedAmount: string;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    if (amount === '-1') {
      convertedAmount = constants.MaxUint256.toString();
    } else {
      const { decimalsOf } = this.erc20Service;
      // eslint-disable-next-line new-cap
      const stakedToken: string = await stakingContract.REWARD_TOKEN();
      const stakedTokenDecimals: number = await decimalsOf(stakedToken);
      convertedAmount = valueToWei(amount, stakedTokenDecimals);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.claimRewards(user, convertedAmount),
      from: user,
      gasSurplus: 20,
      action: ProtocolAction.claimRewards,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.claimRewards,
        ),
      },
    ];
  }

  @StakingValidator
  public async claimRewardsAndStake(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveOrMinusOneAmount() amount: string,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let convertedAmount: string;
    const stakingContract: StakedAaveV3 = this.getContractInstance(
      this.stakingContractAddress,
    );
    if (amount === '-1') {
      convertedAmount = constants.MaxUint256.toString();
    } else {
      const { decimalsOf } = this.erc20Service;
      // eslint-disable-next-line new-cap
      const stakedToken: string = await stakingContract.STAKED_TOKEN();
      const stakedTokenDecimals: number = await decimalsOf(stakedToken);
      convertedAmount = valueToWei(amount, stakedTokenDecimals);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.claimRewardsAndStake(
          user,
          convertedAmount,
        ),
      from: user,
      gasSurplus: 20,
      action: ProtocolAction.claimRewardsAndStake,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.claimRewardsAndStake,
        ),
      },
    ];
  }
}
