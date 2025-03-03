/* Autogenerated file. Do not edit manually. */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from './common';

export declare namespace IUmbrellaBatchHelper {
  export type ClaimPermitStruct = {
    stakeToken: string;
    rewards: string[];
    deadline: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
    restake: boolean;
  };

  export type ClaimPermitStructOutput = [
    string,
    string[],
    BigNumber,
    number,
    string,
    string,
    boolean,
  ] & {
    stakeToken: string;
    rewards: string[];
    deadline: BigNumber;
    v: number;
    r: string;
    s: string;
    restake: boolean;
  };

  export type CooldownPermitStruct = {
    stakeToken: string;
    deadline: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  };

  export type CooldownPermitStructOutput = [
    string,
    BigNumber,
    number,
    string,
    string,
  ] & {
    stakeToken: string;
    deadline: BigNumber;
    v: number;
    r: string;
    s: string;
  };

  export type IODataStruct = {
    stakeToken: string;
    edgeToken: string;
    value: BigNumberish;
  };

  export type IODataStructOutput = [string, string, BigNumber] & {
    stakeToken: string;
    edgeToken: string;
    value: BigNumber;
  };

  export type PermitStruct = {
    token: string;
    value: BigNumberish;
    deadline: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  };

  export type PermitStructOutput = [
    string,
    BigNumber,
    BigNumber,
    number,
    string,
    string,
  ] & {
    token: string;
    value: BigNumber;
    deadline: BigNumber;
    v: number;
    r: string;
    s: string;
  };
}

export interface UmbrellaBatchHelperInterface extends utils.Interface {
  functions: {
    'REWARDS_CONTROLLER()': FunctionFragment;
    'claimRewardsPermit((address,address[],uint256,uint8,bytes32,bytes32,bool))': FunctionFragment;
    'cooldownPermit((address,uint256,uint8,bytes32,bytes32))': FunctionFragment;
    'deposit((address,address,uint256))': FunctionFragment;
    'emergencyEtherTransfer(address,uint256)': FunctionFragment;
    'emergencyTokenTransfer(address,address,uint256)': FunctionFragment;
    'initializePath(address[])': FunctionFragment;
    'maxRescue(address)': FunctionFragment;
    'multicall(bytes[])': FunctionFragment;
    'owner()': FunctionFragment;
    'pause()': FunctionFragment;
    'paused()': FunctionFragment;
    'permit((address,uint256,uint256,uint8,bytes32,bytes32))': FunctionFragment;
    'redeem((address,address,uint256))': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'unpause()': FunctionFragment;
    'whoCanRescue()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'REWARDS_CONTROLLER'
      | 'claimRewardsPermit'
      | 'cooldownPermit'
      | 'deposit'
      | 'emergencyEtherTransfer'
      | 'emergencyTokenTransfer'
      | 'initializePath'
      | 'maxRescue'
      | 'multicall'
      | 'owner'
      | 'pause'
      | 'paused'
      | 'permit'
      | 'redeem'
      | 'renounceOwnership'
      | 'transferOwnership'
      | 'unpause'
      | 'whoCanRescue',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'REWARDS_CONTROLLER',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'claimRewardsPermit',
    values: [IUmbrellaBatchHelper.ClaimPermitStruct],
  ): string;
  encodeFunctionData(
    functionFragment: 'cooldownPermit',
    values: [IUmbrellaBatchHelper.CooldownPermitStruct],
  ): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [IUmbrellaBatchHelper.IODataStruct],
  ): string;
  encodeFunctionData(
    functionFragment: 'emergencyEtherTransfer',
    values: [string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'emergencyTokenTransfer',
    values: [string, string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'initializePath',
    values: [string[]],
  ): string;
  encodeFunctionData(functionFragment: 'maxRescue', values: [string]): string;
  encodeFunctionData(
    functionFragment: 'multicall',
    values: [BytesLike[]],
  ): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'permit',
    values: [IUmbrellaBatchHelper.PermitStruct],
  ): string;
  encodeFunctionData(
    functionFragment: 'redeem',
    values: [IUmbrellaBatchHelper.IODataStruct],
  ): string;
  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [string],
  ): string;
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'whoCanRescue',
    values?: undefined,
  ): string;

  decodeFunctionResult(
    functionFragment: 'REWARDS_CONTROLLER',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'claimRewardsPermit',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'cooldownPermit',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'emergencyEtherTransfer',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'emergencyTokenTransfer',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'initializePath',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'maxRescue', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'multicall', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'permit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'redeem', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'whoCanRescue',
    data: BytesLike,
  ): Result;

  events: {
    'AssetPathInitialized(address)': EventFragment;
    'ERC20Rescued(address,address,address,uint256)': EventFragment;
    'NativeTokensRescued(address,address,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Paused(address)': EventFragment;
    'Unpaused(address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'AssetPathInitialized'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ERC20Rescued'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NativeTokensRescued'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
}

export interface AssetPathInitializedEventObject {
  stakeToken: string;
}
export type AssetPathInitializedEvent = TypedEvent<
  [string],
  AssetPathInitializedEventObject
>;

export type AssetPathInitializedEventFilter =
  TypedEventFilter<AssetPathInitializedEvent>;

export interface ERC20RescuedEventObject {
  caller: string;
  token: string;
  to: string;
  amount: BigNumber;
}
export type ERC20RescuedEvent = TypedEvent<
  [string, string, string, BigNumber],
  ERC20RescuedEventObject
>;

export type ERC20RescuedEventFilter = TypedEventFilter<ERC20RescuedEvent>;

export interface NativeTokensRescuedEventObject {
  caller: string;
  to: string;
  amount: BigNumber;
}
export type NativeTokensRescuedEvent = TypedEvent<
  [string, string, BigNumber],
  NativeTokensRescuedEventObject
>;

export type NativeTokensRescuedEventFilter =
  TypedEventFilter<NativeTokensRescuedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface UmbrellaBatchHelper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UmbrellaBatchHelperInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    REWARDS_CONTROLLER(overrides?: CallOverrides): Promise<[string]>;

    claimRewardsPermit(
      p: IUmbrellaBatchHelper.ClaimPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    cooldownPermit(
      p: IUmbrellaBatchHelper.CooldownPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    deposit(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    emergencyEtherTransfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    emergencyTokenTransfer(
      erc20Token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    initializePath(
      stakeTokens: string[],
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    maxRescue(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    permit(
      p: IUmbrellaBatchHelper.PermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    redeem(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;

    whoCanRescue(overrides?: CallOverrides): Promise<[string]>;
  };

  REWARDS_CONTROLLER(overrides?: CallOverrides): Promise<string>;

  claimRewardsPermit(
    p: IUmbrellaBatchHelper.ClaimPermitStruct,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  cooldownPermit(
    p: IUmbrellaBatchHelper.CooldownPermitStruct,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  deposit(
    io: IUmbrellaBatchHelper.IODataStruct,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  emergencyEtherTransfer(
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  emergencyTokenTransfer(
    erc20Token: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  initializePath(
    stakeTokens: string[],
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  maxRescue(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  multicall(
    data: BytesLike[],
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  permit(
    p: IUmbrellaBatchHelper.PermitStruct,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  redeem(
    io: IUmbrellaBatchHelper.IODataStruct,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;

  whoCanRescue(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    REWARDS_CONTROLLER(overrides?: CallOverrides): Promise<string>;

    claimRewardsPermit(
      p: IUmbrellaBatchHelper.ClaimPermitStruct,
      overrides?: CallOverrides,
    ): Promise<void>;

    cooldownPermit(
      p: IUmbrellaBatchHelper.CooldownPermitStruct,
      overrides?: CallOverrides,
    ): Promise<void>;

    deposit(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: CallOverrides,
    ): Promise<void>;

    emergencyEtherTransfer(
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    emergencyTokenTransfer(
      erc20Token: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    initializePath(
      stakeTokens: string[],
      overrides?: CallOverrides,
    ): Promise<void>;

    maxRescue(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    multicall(data: BytesLike[], overrides?: CallOverrides): Promise<string[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    permit(
      p: IUmbrellaBatchHelper.PermitStruct,
      overrides?: CallOverrides,
    ): Promise<void>;

    redeem(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: CallOverrides,
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    whoCanRescue(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'AssetPathInitialized(address)'(
      stakeToken?: null,
    ): AssetPathInitializedEventFilter;
    AssetPathInitialized(stakeToken?: null): AssetPathInitializedEventFilter;

    'ERC20Rescued(address,address,address,uint256)'(
      caller?: string | null,
      token?: string | null,
      to?: string | null,
      amount?: null,
    ): ERC20RescuedEventFilter;
    ERC20Rescued(
      caller?: string | null,
      token?: string | null,
      to?: string | null,
      amount?: null,
    ): ERC20RescuedEventFilter;

    'NativeTokensRescued(address,address,uint256)'(
      caller?: string | null,
      to?: string | null,
      amount?: null,
    ): NativeTokensRescuedEventFilter;
    NativeTokensRescued(
      caller?: string | null,
      to?: string | null,
      amount?: null,
    ): NativeTokensRescuedEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;

    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };

  estimateGas: {
    REWARDS_CONTROLLER(overrides?: CallOverrides): Promise<BigNumber>;

    claimRewardsPermit(
      p: IUmbrellaBatchHelper.ClaimPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    cooldownPermit(
      p: IUmbrellaBatchHelper.CooldownPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    deposit(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    emergencyEtherTransfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    emergencyTokenTransfer(
      erc20Token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    initializePath(
      stakeTokens: string[],
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    maxRescue(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    permit(
      p: IUmbrellaBatchHelper.PermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    redeem(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;

    unpause(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    whoCanRescue(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    REWARDS_CONTROLLER(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    claimRewardsPermit(
      p: IUmbrellaBatchHelper.ClaimPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    cooldownPermit(
      p: IUmbrellaBatchHelper.CooldownPermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    deposit(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    emergencyEtherTransfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    emergencyTokenTransfer(
      erc20Token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    initializePath(
      stakeTokens: string[],
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    maxRescue(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    permit(
      p: IUmbrellaBatchHelper.PermitStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    redeem(
      io: IUmbrellaBatchHelper.IODataStruct,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;

    whoCanRescue(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
