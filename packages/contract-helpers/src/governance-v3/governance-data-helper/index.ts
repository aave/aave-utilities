import { providers } from 'ethers';
import {
  GovernanceDataHelper as GovernanceDataHelperContract,
  IGovernanceDataHelper,
} from '../typechain/GovernanceDataHelper';
import { GovernanceDataHelper__factory } from '../typechain/factories/GovernanceDataHelper__factory';

export interface GovernanceDataHelperInterface {
  getConstants: (
    govCore: string,
    accessLevels: number[],
  ) => Promise<IGovernanceDataHelper.ConstantsStruct>;
  getProposalsData: (
    govCore: string,
    from: number,
    to: number,
    pageSize: number,
  ) => Promise<IGovernanceDataHelper.ProposalStruct[]>;
  getRepresentationData: (
    govCore: string,
    wallet: string,
    chainIds: number[],
  ) => Promise<
    [
      IGovernanceDataHelper.RepresentativesStruct[],
      IGovernanceDataHelper.RepresentedStruct[],
    ]
  >;
}

export class GovernanceDataHelperService
  implements GovernanceDataHelperInterface
{
  private readonly _contract: GovernanceDataHelperContract;

  constructor(
    governanceDataHelperContractAddress: string,
    provider: providers.Provider,
  ) {
    this._contract = GovernanceDataHelper__factory.connect(
      governanceDataHelperContractAddress,
      provider,
    );
  }

  public async getConstants(govCore: string, accessLevels: number[]) {
    return this._contract.getConstants(govCore, accessLevels);
  }

  public async getProposalsData(
    govCore: string,
    from: number,
    to: number,
    pageSize: number,
  ) {
    return this._contract.getProposalsData(govCore, from, to, pageSize);
  }

  public async getRepresentationData(
    govCore: string,
    wallet: string,
    chainIds: number[],
  ) {
    return this._contract.getRepresentationData(govCore, wallet, chainIds);
  }
}
