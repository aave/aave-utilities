/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import { Provider } from '@ethersproject/providers';
import { Contract, Signer } from 'ethers';
import type { StakeUiHelperI } from './StakeUiHelperI';

export class StakeUiHelperFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): StakeUiHelperI {
    return new Contract(address, _abi, signerOrProvider) as StakeUiHelperI;
  }
}

const _abi = [
  {
    inputs: [],
    name: 'getGeneralStakeUIData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.GeneralStakeUIData',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.GeneralStakeUIData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getStkAaveData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.AssetUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getStkBptData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.AssetUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStkGeneralAaveData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.GeneralStakeUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStkGeneralBptData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.GeneralStakeUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getStkUserAaveData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getStkUserBptData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'user',
        type: 'address[]',
      },
    ],
    name: 'getStkUsersAaveData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'user',
        type: 'address[]',
      },
    ],
    name: 'getStkUsersBptData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserStakeUIData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserUIData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.AssetUIData',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenTotalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeCooldownSeconds',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeUnstakeWindow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenPriceEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeApy',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'distributionPerSecond',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'distributionEnd',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.AssetUIData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'user',
        type: 'address[]',
      },
    ],
    name: 'getUsersStakeUIData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stakeTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingTokenUserBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userCooldown',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userIncentivesToClaim',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userPermitNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct StakeUIHelperI.UserStakeUIData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
