import {
    BigNumberish,
    BytesLike,
    PopulatedTransaction,
    providers,
    utils,
} from 'ethers';
import BaseService from '../commons/BaseService';
import { InterestRate } from '../commons/types';
import {
    ParaSwapDebtSwapAdapter,
    ParaSwapDebtSwapAdapterInterface,
} from './typechain/ParaSwapDebtSwitchAdapter';
import { ParaSwapDebtSwapAdapter__factory } from './typechain/ParaSwapDebtSwitchAdapter__factory';

export type DebtSwitchType = {
    user: string;
    debtAsset: string;
    debtRepayAmount: string;
    debtRateMode: InterestRate;
    newDebtAsset: string;
    maxNewDebtAmount: string;
    offset: number;
    paraswapData: string;
    deadline: BigNumberish;
    sigV: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
};

export interface ParaswapDebtSwitchInterface {
    debtSwitch: (args: DebtSwitchType) => PopulatedTransaction;
}

export class ParaSwapDebtSwitch
    extends BaseService<ParaSwapDebtSwapAdapter>
    implements ParaswapDebtSwitchInterface {
    readonly debtSwitchAddress: string;
    readonly contractInterface: ParaSwapDebtSwapAdapterInterface;

    constructor(provider: providers.Provider, debtSwitchAddress?: string) {
        super(provider, ParaSwapDebtSwapAdapter__factory);

        this.debtSwitchAddress = debtSwitchAddress ?? '';

        this.contractInterface = ParaSwapDebtSwapAdapter__factory.createInterface();

        this.debtSwitch = this.debtSwitch.bind(this);
    }

    public debtSwitch({
        user,
        debtAsset,
        debtRepayAmount,
        debtRateMode,
        newDebtAsset,
        maxNewDebtAmount,
        offset,
        paraswapData,
        deadline,
        sigV,
        sigR,
        sigS,
    }: DebtSwitchType): PopulatedTransaction {
        const encodedParams = utils.defaultAbiCoder.encode(
            [
                'address',
                'uint256',
                'uint256',
                'address',
                'uint256',
                'uint256',
                'bytes',
            ],
            [
                debtAsset,
                debtRepayAmount,
                debtRateMode,
                newDebtAsset,
                maxNewDebtAmount,
                offset,
                paraswapData,
            ],
        );

        const encodedCreditDelegationParams = utils.defaultAbiCoder.encode(
            ['address', 'uint256', 'uint256', 'uint8', 'bytes32', 'bytes32'],
            [debtAsset, debtRepayAmount, deadline, sigV, sigR, sigS],
        );

        const actionTx: PopulatedTransaction = {};

        const txData = this.contractInterface.encodeFunctionData('swapDebt', [
            encodedParams,
            encodedCreditDelegationParams,
        ]);

        actionTx.to = this.debtSwitchAddress;
        actionTx.data = txData;
        actionTx.from = user;

        return actionTx;
    }
}
