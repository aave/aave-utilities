import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import type { GhoToken } from './typechain/GhoToken';
import { GhoToken__factory } from './typechain/GhoToken__factory';
import type { IGhoToken } from './typechain/IGhoToken';

interface IGhoTokenService {
  totalSupply: () => Promise<BigNumber>;
  getFacilitatorsList: () => Promise<string[]>;
  getFacilitator: (
    facilitatorAddress: string,
  ) => Promise<IGhoToken.FacilitatorStruct>;
  getFacilitatorBucket: (
    facilitatorAddress: string,
  ) => Promise<IGhoToken.BucketStruct>;
}

/**
 * The service for interacting with the GhoToken.sol smart contract.
 * This contract controls operations minting & burning the native GHO token as well as facilitator management.
 * https://github.com/aave/gho/blob/main/src/contracts/gho/GhoToken.sol
 */
export class GhoTokenService
  extends BaseService<GhoToken>
  implements IGhoTokenService
{
  readonly ghoTokenAddress: string;

  constructor(provider: providers.Provider, ghoTokenAddress: string) {
    super(provider, GhoToken__factory);
    this.ghoTokenAddress = ghoTokenAddress;
  }

  /**
   * Gets the total supply for the GHO token. This is the sum of all facilitators' current bucket levels
   * @returns - A BigNumber representing the total supply of GHO
   */
  public async totalSupply() {
    const contract = this.getContractInstance(this.ghoTokenAddress);
    const result = await contract.totalSupply();
    return result;
  }

  /**
   * Gets the full list of facilitators for the GHO token
   * @returns - An array of facilitator addresses, which can be used for querying in more detail
   */
  public async getFacilitatorsList() {
    const contract = this.getContractInstance(this.ghoTokenAddress);
    const result = await contract.getFacilitatorsList();
    return result;
  }

  /**
   * Gets the instance for a given facilitator
   * @param facilitatorAddress - The address for the currently deployed contract for the facilitator being queried
   * @returns - The instance of the facilitator, which contains `bucket` and `label` fields
   */
  public async getFacilitator(facilitatorAddress: string) {
    const contract = this.getContractInstance(this.ghoTokenAddress);
    const result = await contract.getFacilitator(facilitatorAddress);
    return result;
  }

  /**
   * Gets the bucket instance for a given facilitator
   * @param facilitatorAddress - The address for the currently deployed contract for the facilitator being queried
   * @returns - The instance of the facilitator bucket, which contains `maxCapacity` and `level` fields
   */
  public async getFacilitatorBucket(facilitatorAddress: string) {
    const contract = this.getContractInstance(this.ghoTokenAddress);
    const result = await contract.getFacilitatorBucket(facilitatorAddress);
    return result;
  }
}
