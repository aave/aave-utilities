import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { GhoToken__factory } from './typechain/GhoToken__factory';
import type { IGhoToken } from './typechain/IGhoToken';

interface IGhoTokenService {
  getFacilitatorBucket: (
    facilitatorAddress: string,
  ) => Promise<IGhoToken.BucketStruct>;
}

/**
 * The service for interacting with the GhoToken.sol smart contract.
 * This contract controls operations minting & burning the native GHO token as well as faciliator management.
 * https://github.com/aave/gho/blob/main/src/contracts/gho/GhoToken.sol
 */
export class GhoTokenService
  extends BaseService<IGhoToken>
  implements IGhoTokenService
{
  readonly ghoTokenAddress: string;

  constructor(provider: providers.Provider, ghoTokenAddress: string) {
    super(provider, GhoToken__factory);
    this.ghoTokenAddress = ghoTokenAddress;
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
