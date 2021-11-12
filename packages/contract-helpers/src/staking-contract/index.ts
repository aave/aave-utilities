import { SignatureLike } from '@ethersproject/bytes';
import { constants, utils, Signature, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { DEFAULT_APPROVE_AMOUNT, valueToWei } from '../commons/utils';
import {
  SignStakingValidator,
  StakingValidator,
} from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { IAaveStakingHelper } from './typechain/IAaveStakingHelper';
import { IAaveStakingHelper__factory } from './typechain/IAaveStakingHelper__factory';
import { IStakedToken } from './typechain/IStakedToken';
import { IStakedToken__factory } from './typechain/IStakedToken__factory';

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
    nonce: string,
  ) => Promise<string>;
  stakeWithPermit: (
    user: tEthereumAddress,
    amount: string,
    signature: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

type StakingServiceConfig = {
  TOKEN_STAKING_ADDRESS: string;
  STAKING_HELPER_ADDRESS?: string;
};

export class StakingService
  extends BaseService<IStakedToken>
  implements StakingInterface
{
  readonly stakingHelperContract: IAaveStakingHelper;

  public readonly stakingContractAddress: tEthereumAddress;

  readonly stakingHelperContractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(
    provider: providers.Provider,
    stakingServiceConfig: StakingServiceConfig,
  ) {
    super(provider, IStakedToken__factory);

    this.erc20Service = new ERC20Service(provider);

    this.stakingContractAddress = stakingServiceConfig.TOKEN_STAKING_ADDRESS;
    this.stakingHelperContractAddress =
      stakingServiceConfig.STAKING_HELPER_ADDRESS ?? '';

    if (this.stakingHelperContractAddress !== '') {
      this.stakingHelperContract = IAaveStakingHelper__factory.connect(
        this.stakingHelperContractAddress,
        provider,
      );
    }
  }

  @SignStakingValidator
  public async signStaking(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveAmount() amount: string,
    @is0OrPositiveAmount() nonce: string,
  ): Promise<string> {
    const { getTokenData } = this.erc20Service;
    const stakingContract: IStakedToken = this.getContractInstance(
      this.stakingContractAddress,
    );
    // eslint-disable-next-line new-cap
    const stakedToken: string = await stakingContract.STAKED_TOKEN();
    const { name, decimals } = await getTokenData(stakedToken);
    const convertedAmount: string = valueToWei(amount, decimals);
    const { chainId } = await this.provider.getNetwork();

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
        version: '1',
        chainId,
        verifyingContract: stakedToken,
      },
      message: {
        owner: user,
        spender: this.stakingHelperContractAddress,
        value: convertedAmount,
        nonce,
        deadline: constants.MaxUint256.toString(),
      },
    };

    return JSON.stringify(typeData);
  }

  @SignStakingValidator
  public async stakeWithPermit(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveAmount() amount: string,
    signature: SignatureLike,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { decimalsOf } = this.erc20Service;
    const stakingContract: IStakedToken = this.getContractInstance(
      this.stakingContractAddress,
    );
    // eslint-disable-next-line new-cap
    const stakedToken: string = await stakingContract.STAKED_TOKEN();
    const stakedTokenDecimals: number = await decimalsOf(stakedToken);
    const convertedAmount: string = valueToWei(amount, stakedTokenDecimals);
    const sig: Signature = utils.splitSignature(signature);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        this.stakingHelperContract.populateTransaction.stake(
          user,
          convertedAmount,
          sig.v,
          sig.r,
          sig.s,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
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
    const stakingContract: IStakedToken = this.getContractInstance(
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

    console.log(stakingContract);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        stakingContract.populateTransaction.stake(
          onBehalfOf ?? user,
          convertedAmount,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @StakingValidator
  public async redeem(
    @isEthAddress() user: tEthereumAddress,
    @isPositiveOrMinusOneAmount() amount: string,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let convertedAmount: string;
    const stakingContract: IStakedToken = this.getContractInstance(
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
    const stakingContract: IStakedToken = this.getContractInstance(
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
    const stakingContract: IStakedToken = this.getContractInstance(
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
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}
