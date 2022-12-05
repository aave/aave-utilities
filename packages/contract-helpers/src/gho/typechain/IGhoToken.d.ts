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
} from '../../../../common';

export declare namespace IGhoToken {
  export type BucketStruct = { maxCapacity: BigNumberish; level: BigNumberish };

  export type BucketStructOutput = [BigNumber, BigNumber] & {
    maxCapacity: BigNumber;
    level: BigNumber;
  };

  export type FacilitatorStruct = {
    bucket: IGhoToken.BucketStruct;
    label: string;
  };

  export type FacilitatorStructOutput = [
    IGhoToken.BucketStructOutput,
    string,
  ] & { bucket: IGhoToken.BucketStructOutput; label: string };
}

export interface IGhoTokenInterface extends utils.Interface {
  functions: {
    'addFacilitators(address[],((uint128,uint128),string)[])': FunctionFragment;
    'burn(uint256)': FunctionFragment;
    'getFacilitator(address)': FunctionFragment;
    'getFacilitatorBucket(address)': FunctionFragment;
    'getFacilitatorsList()': FunctionFragment;
    'mint(address,uint256)': FunctionFragment;
    'removeFacilitators(address[])': FunctionFragment;
    'setFacilitatorBucketCapacity(address,uint128)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'addFacilitators'
      | 'burn'
      | 'getFacilitator'
      | 'getFacilitatorBucket'
      | 'getFacilitatorsList'
      | 'mint'
      | 'removeFacilitators'
      | 'setFacilitatorBucketCapacity',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'addFacilitators',
    values: [string[], IGhoToken.FacilitatorStruct[]],
  ): string;
  encodeFunctionData(functionFragment: 'burn', values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: 'getFacilitator',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getFacilitatorBucket',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getFacilitatorsList',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'mint',
    values: [string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'removeFacilitators',
    values: [string[]],
  ): string;
  encodeFunctionData(
    functionFragment: 'setFacilitatorBucketCapacity',
    values: [string, BigNumberish],
  ): string;

  decodeFunctionResult(
    functionFragment: 'addFacilitators',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'getFacilitator',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getFacilitatorBucket',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getFacilitatorsList',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'removeFacilitators',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setFacilitatorBucketCapacity',
    data: BytesLike,
  ): Result;

  events: {
    'BucketLevelChanged(address,uint256,uint256)': EventFragment;
    'FacilitatorAdded(address,string,uint256)': EventFragment;
    'FacilitatorBucketCapacityUpdated(address,uint256,uint256)': EventFragment;
    'FacilitatorRemoved(address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'BucketLevelChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'FacilitatorAdded'): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: 'FacilitatorBucketCapacityUpdated',
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'FacilitatorRemoved'): EventFragment;
}

export interface BucketLevelChangedEventObject {
  facilitatorAaddress: string;
  oldLevel: BigNumber;
  newLevel: BigNumber;
}
export type BucketLevelChangedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  BucketLevelChangedEventObject
>;

export type BucketLevelChangedEventFilter =
  TypedEventFilter<BucketLevelChangedEvent>;

export interface FacilitatorAddedEventObject {
  facilitatorAddress: string;
  label: string;
  initialBucketCapacity: BigNumber;
}
export type FacilitatorAddedEvent = TypedEvent<
  [string, string, BigNumber],
  FacilitatorAddedEventObject
>;

export type FacilitatorAddedEventFilter =
  TypedEventFilter<FacilitatorAddedEvent>;

export interface FacilitatorBucketCapacityUpdatedEventObject {
  facilitatorAaddress: string;
  oldCapacity: BigNumber;
  newCapacity: BigNumber;
}
export type FacilitatorBucketCapacityUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  FacilitatorBucketCapacityUpdatedEventObject
>;

export type FacilitatorBucketCapacityUpdatedEventFilter =
  TypedEventFilter<FacilitatorBucketCapacityUpdatedEvent>;

export interface FacilitatorRemovedEventObject {
  facilitatorAddress: string;
}
export type FacilitatorRemovedEvent = TypedEvent<
  [string],
  FacilitatorRemovedEventObject
>;

export type FacilitatorRemovedEventFilter =
  TypedEventFilter<FacilitatorRemovedEvent>;

export interface IGhoToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IGhoTokenInterface;

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
    addFacilitators(
      facilitatorsAddresses: string[],
      facilitatorsConfig: IGhoToken.FacilitatorStruct[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    getFacilitator(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<[IGhoToken.FacilitatorStructOutput]>;

    getFacilitatorBucket(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<[IGhoToken.BucketStructOutput]>;

    getFacilitatorsList(overrides?: CallOverrides): Promise<[string[]]>;

    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    removeFacilitators(
      facilitators: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setFacilitatorBucketCapacity(
      facilitator: string,
      newCapacity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  addFacilitators(
    facilitatorsAddresses: string[],
    facilitatorsConfig: IGhoToken.FacilitatorStruct[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  burn(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  getFacilitator(
    facilitator: string,
    overrides?: CallOverrides,
  ): Promise<IGhoToken.FacilitatorStructOutput>;

  getFacilitatorBucket(
    facilitator: string,
    overrides?: CallOverrides,
  ): Promise<IGhoToken.BucketStructOutput>;

  getFacilitatorsList(overrides?: CallOverrides): Promise<string[]>;

  mint(
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  removeFacilitators(
    facilitators: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setFacilitatorBucketCapacity(
    facilitator: string,
    newCapacity: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    addFacilitators(
      facilitatorsAddresses: string[],
      facilitatorsConfig: IGhoToken.FacilitatorStruct[],
      overrides?: CallOverrides,
    ): Promise<void>;

    burn(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    getFacilitator(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<IGhoToken.FacilitatorStructOutput>;

    getFacilitatorBucket(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<IGhoToken.BucketStructOutput>;

    getFacilitatorsList(overrides?: CallOverrides): Promise<string[]>;

    mint(
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    removeFacilitators(
      facilitators: string[],
      overrides?: CallOverrides,
    ): Promise<void>;

    setFacilitatorBucketCapacity(
      facilitator: string,
      newCapacity: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'BucketLevelChanged(address,uint256,uint256)'(
      facilitatorAaddress?: string | null,
      oldLevel?: null,
      newLevel?: null,
    ): BucketLevelChangedEventFilter;
    BucketLevelChanged(
      facilitatorAaddress?: string | null,
      oldLevel?: null,
      newLevel?: null,
    ): BucketLevelChangedEventFilter;

    'FacilitatorAdded(address,string,uint256)'(
      facilitatorAddress?: string | null,
      label?: string | null,
      initialBucketCapacity?: null,
    ): FacilitatorAddedEventFilter;
    FacilitatorAdded(
      facilitatorAddress?: string | null,
      label?: string | null,
      initialBucketCapacity?: null,
    ): FacilitatorAddedEventFilter;

    'FacilitatorBucketCapacityUpdated(address,uint256,uint256)'(
      facilitatorAaddress?: string | null,
      oldCapacity?: null,
      newCapacity?: null,
    ): FacilitatorBucketCapacityUpdatedEventFilter;
    FacilitatorBucketCapacityUpdated(
      facilitatorAaddress?: string | null,
      oldCapacity?: null,
      newCapacity?: null,
    ): FacilitatorBucketCapacityUpdatedEventFilter;

    'FacilitatorRemoved(address)'(
      facilitatorAddress?: string | null,
    ): FacilitatorRemovedEventFilter;
    FacilitatorRemoved(
      facilitatorAddress?: string | null,
    ): FacilitatorRemovedEventFilter;
  };

  estimateGas: {
    addFacilitators(
      facilitatorsAddresses: string[],
      facilitatorsConfig: IGhoToken.FacilitatorStruct[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    getFacilitator(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getFacilitatorBucket(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getFacilitatorsList(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    removeFacilitators(
      facilitators: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setFacilitatorBucketCapacity(
      facilitator: string,
      newCapacity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addFacilitators(
      facilitatorsAddresses: string[],
      facilitatorsConfig: IGhoToken.FacilitatorStruct[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    getFacilitator(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getFacilitatorBucket(
      facilitator: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getFacilitatorsList(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    removeFacilitators(
      facilitators: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setFacilitatorBucketCapacity(
      facilitator: string,
      newCapacity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
