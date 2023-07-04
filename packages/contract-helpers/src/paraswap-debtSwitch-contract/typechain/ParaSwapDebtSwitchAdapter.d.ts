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
} from "ethers";
import type {
    FunctionFragment,
    Result,
    EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
    TypedEventFilter,
    TypedEvent,
    TypedListener,
    OnEvent,
} from "./common";

export declare namespace ParaSwapDebtSwapAdapter {
    export type DebtSwapParamsStruct = {
        debtAsset: string;
        debtRepayAmount: BigNumberish;
        debtRateMode: BigNumberish;
        newDebtAsset: string;
        maxNewDebtAmount: BigNumberish;
        offset: BigNumberish;
        paraswapData: BytesLike;
    };

    export type DebtSwapParamsStructOutput = [
        string,
        BigNumber,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        string
    ] & {
        debtAsset: string;
        debtRepayAmount: BigNumber;
        debtRateMode: BigNumber;
        newDebtAsset: string;
        maxNewDebtAmount: BigNumber;
        offset: BigNumber;
        paraswapData: string;
    };

    export type CreditDelegationInputStruct = {
        debtToken: string;
        value: BigNumberish;
        deadline: BigNumberish;
        v: BigNumberish;
        r: BytesLike;
        s: BytesLike;
    };

    export type CreditDelegationInputStructOutput = [
        string,
        BigNumber,
        BigNumber,
        number,
        string,
        string
    ] & {
        debtToken: string;
        value: BigNumber;
        deadline: BigNumber;
        v: number;
        r: string;
        s: string;
    };
}

export interface ParaSwapDebtSwapAdapterInterface extends utils.Interface {
    functions: {
        "ADDRESSES_PROVIDER()": FunctionFragment;
        "AUGUSTUS_REGISTRY()": FunctionFragment;
        "MAX_SLIPPAGE_PERCENT()": FunctionFragment;
        "ORACLE()": FunctionFragment;
        "POOL()": FunctionFragment;
        "REFERRER()": FunctionFragment;
        "cacheReserves()": FunctionFragment;
        "executeOperation(address[],uint256[],uint256[],address,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "renewAllowance(address)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "rescueTokens(address)": FunctionFragment;
        "swapDebt((address,uint256,uint256,address,uint256,uint256,bytes),(address,uint256,uint256,uint8,bytes32,bytes32))": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };

    getFunction(
        nameOrSignatureOrTopic:
            | "ADDRESSES_PROVIDER"
            | "AUGUSTUS_REGISTRY"
            | "MAX_SLIPPAGE_PERCENT"
            | "ORACLE"
            | "POOL"
            | "REFERRER"
            | "cacheReserves"
            | "executeOperation"
            | "owner"
            | "renewAllowance"
            | "renounceOwnership"
            | "rescueTokens"
            | "swapDebt"
            | "transferOwnership"
    ): FunctionFragment;

    encodeFunctionData(
        functionFragment: "ADDRESSES_PROVIDER",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "AUGUSTUS_REGISTRY",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "MAX_SLIPPAGE_PERCENT",
        values?: undefined
    ): string;
    encodeFunctionData(functionFragment: "ORACLE", values?: undefined): string;
    encodeFunctionData(functionFragment: "POOL", values?: undefined): string;
    encodeFunctionData(functionFragment: "REFERRER", values?: undefined): string;
    encodeFunctionData(
        functionFragment: "cacheReserves",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "executeOperation",
        values: [string[], BigNumberish[], BigNumberish[], string, BytesLike]
    ): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(
        functionFragment: "renewAllowance",
        values: [string]
    ): string;
    encodeFunctionData(
        functionFragment: "renounceOwnership",
        values?: undefined
    ): string;
    encodeFunctionData(
        functionFragment: "rescueTokens",
        values: [string]
    ): string;
    encodeFunctionData(
        functionFragment: "swapDebt",
        values: [
            ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
            ParaSwapDebtSwapAdapter.CreditDelegationInputStruct
        ]
    ): string;
    encodeFunctionData(
        functionFragment: "transferOwnership",
        values: [string]
    ): string;

    decodeFunctionResult(
        functionFragment: "ADDRESSES_PROVIDER",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "AUGUSTUS_REGISTRY",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "MAX_SLIPPAGE_PERCENT",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "ORACLE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "POOL", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "REFERRER", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "cacheReserves",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "executeOperation",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "renewAllowance",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "renounceOwnership",
        data: BytesLike
    ): Result;
    decodeFunctionResult(
        functionFragment: "rescueTokens",
        data: BytesLike
    ): Result;
    decodeFunctionResult(functionFragment: "swapDebt", data: BytesLike): Result;
    decodeFunctionResult(
        functionFragment: "transferOwnership",
        data: BytesLike
    ): Result;

    events: {
        "Bought(address,address,uint256,uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "Swapped(address,address,uint256,uint256)": EventFragment;
    };

    getEvent(nameOrSignatureOrTopic: "Bought"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Swapped"): EventFragment;
}

export interface BoughtEventObject {
    fromAsset: string;
    toAsset: string;
    amountSold: BigNumber;
    receivedAmount: BigNumber;
}
export type BoughtEvent = TypedEvent<
    [string, string, BigNumber, BigNumber],
    BoughtEventObject
>;

export type BoughtEventFilter = TypedEventFilter<BoughtEvent>;

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

export interface SwappedEventObject {
    fromAsset: string;
    toAsset: string;
    fromAmount: BigNumber;
    receivedAmount: BigNumber;
}
export type SwappedEvent = TypedEvent<
    [string, string, BigNumber, BigNumber],
    SwappedEventObject
>;

export type SwappedEventFilter = TypedEventFilter<SwappedEvent>;

export interface ParaSwapDebtSwapAdapter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    interface: ParaSwapDebtSwapAdapterInterface;

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>;

    listeners<TEvent extends TypedEvent>(
        eventFilter?: TypedEventFilter<TEvent>
    ): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(
        eventFilter: TypedEventFilter<TEvent>
    ): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;

    functions: {
        ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<[string]>;

        AUGUSTUS_REGISTRY(overrides?: CallOverrides): Promise<[string]>;

        MAX_SLIPPAGE_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

        ORACLE(overrides?: CallOverrides): Promise<[string]>;

        POOL(overrides?: CallOverrides): Promise<[string]>;

        REFERRER(overrides?: CallOverrides): Promise<[number]>;

        cacheReserves(
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        executeOperation(
            assets: string[],
            amounts: BigNumberish[],
            arg2: BigNumberish[],
            initiator: string,
            params: BytesLike,
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        owner(overrides?: CallOverrides): Promise<[string]>;

        renewAllowance(
            reserve: string,
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        renounceOwnership(
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        rescueTokens(
            token: string,
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        swapDebt(
            debtSwapParams: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
            creditDelegationPermit: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct,
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;

        transferOwnership(
            newOwner: string,
            overrides?: Overrides & { from?: string }
        ): Promise<ContractTransaction>;
    };

    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>;

    AUGUSTUS_REGISTRY(overrides?: CallOverrides): Promise<string>;

    MAX_SLIPPAGE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    ORACLE(overrides?: CallOverrides): Promise<string>;

    POOL(overrides?: CallOverrides): Promise<string>;

    REFERRER(overrides?: CallOverrides): Promise<number>;

    cacheReserves(
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    executeOperation(
        assets: string[],
        amounts: BigNumberish[],
        arg2: BigNumberish[],
        initiator: string,
        params: BytesLike,
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<string>;

    renewAllowance(
        reserve: string,
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    renounceOwnership(
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    rescueTokens(
        token: string,
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    swapDebt(
        debtSwapParams: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
        creditDelegationPermit: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct,
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    transferOwnership(
        newOwner: string,
        overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    callStatic: {
        ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>;

        AUGUSTUS_REGISTRY(overrides?: CallOverrides): Promise<string>;

        MAX_SLIPPAGE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

        ORACLE(overrides?: CallOverrides): Promise<string>;

        POOL(overrides?: CallOverrides): Promise<string>;

        REFERRER(overrides?: CallOverrides): Promise<number>;

        cacheReserves(overrides?: CallOverrides): Promise<void>;

        executeOperation(
            assets: string[],
            amounts: BigNumberish[],
            arg2: BigNumberish[],
            initiator: string,
            params: BytesLike,
            overrides?: CallOverrides
        ): Promise<boolean>;

        owner(overrides?: CallOverrides): Promise<string>;

        renewAllowance(reserve: string, overrides?: CallOverrides): Promise<void>;

        renounceOwnership(overrides?: CallOverrides): Promise<void>;

        rescueTokens(token: string, overrides?: CallOverrides): Promise<void>;

        swapDebt(
            debtSwapParams: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
            creditDelegationPermit: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct,
            overrides?: CallOverrides
        ): Promise<void>;

        transferOwnership(
            newOwner: string,
            overrides?: CallOverrides
        ): Promise<void>;
    };

    filters: {
        "Bought(address,address,uint256,uint256)"(
            fromAsset?: string | null,
            toAsset?: string | null,
            amountSold?: null,
            receivedAmount?: null
        ): BoughtEventFilter;
        Bought(
            fromAsset?: string | null,
            toAsset?: string | null,
            amountSold?: null,
            receivedAmount?: null
        ): BoughtEventFilter;

        "OwnershipTransferred(address,address)"(
            previousOwner?: string | null,
            newOwner?: string | null
        ): OwnershipTransferredEventFilter;
        OwnershipTransferred(
            previousOwner?: string | null,
            newOwner?: string | null
        ): OwnershipTransferredEventFilter;

        "Swapped(address,address,uint256,uint256)"(
            fromAsset?: string | null,
            toAsset?: string | null,
            fromAmount?: null,
            receivedAmount?: null
        ): SwappedEventFilter;
        Swapped(
            fromAsset?: string | null,
            toAsset?: string | null,
            fromAmount?: null,
            receivedAmount?: null
        ): SwappedEventFilter;
    };

    estimateGas: {
        ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;

        AUGUSTUS_REGISTRY(overrides?: CallOverrides): Promise<BigNumber>;

        MAX_SLIPPAGE_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

        ORACLE(overrides?: CallOverrides): Promise<BigNumber>;

        POOL(overrides?: CallOverrides): Promise<BigNumber>;

        REFERRER(overrides?: CallOverrides): Promise<BigNumber>;

        cacheReserves(
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        executeOperation(
            assets: string[],
            amounts: BigNumberish[],
            arg2: BigNumberish[],
            initiator: string,
            params: BytesLike,
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        owner(overrides?: CallOverrides): Promise<BigNumber>;

        renewAllowance(
            reserve: string,
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        renounceOwnership(
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        rescueTokens(
            token: string,
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        swapDebt(
            debtSwapParams: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
            creditDelegationPermit: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct,
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;

        transferOwnership(
            newOwner: string,
            overrides?: Overrides & { from?: string }
        ): Promise<BigNumber>;
    };

    populateTransaction: {
        ADDRESSES_PROVIDER(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        AUGUSTUS_REGISTRY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        MAX_SLIPPAGE_PERCENT(
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        ORACLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        POOL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        REFERRER(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        cacheReserves(
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        executeOperation(
            assets: string[],
            amounts: BigNumberish[],
            arg2: BigNumberish[],
            initiator: string,
            params: BytesLike,
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        renewAllowance(
            reserve: string,
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        renounceOwnership(
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        rescueTokens(
            token: string,
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        swapDebt(
            debtSwapParams: ParaSwapDebtSwapAdapter.DebtSwapParamsStruct,
            creditDelegationPermit: ParaSwapDebtSwapAdapter.CreditDelegationInputStruct,
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;

        transferOwnership(
            newOwner: string,
            overrides?: Overrides & { from?: string }
        ): Promise<PopulatedTransaction>;
    };
}
