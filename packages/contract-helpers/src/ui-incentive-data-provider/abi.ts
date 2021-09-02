export const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },

  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
    ],
    name: 'getReservesIncentivesData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'emissionPerSecond',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'incentivesLastUpdateTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'tokenIncentivesIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'emissionEndTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.IncentiveData',
            name: 'aIncentiveData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'emissionPerSecond',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'incentivesLastUpdateTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'tokenIncentivesIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'emissionEndTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.IncentiveData',
            name: 'vIncentiveData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'emissionPerSecond',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'incentivesLastUpdateTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'tokenIncentivesIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'emissionEndTimestamp',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.IncentiveData',
            name: 'sIncentiveData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProvider.AggregatedReserveIncentiveData[]',
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
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserReservesIncentivesData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'tokenincentivesUserIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'userUnclaimedRewards',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.UserIncentiveData',
            name: 'aTokenIncentivesUserData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'tokenincentivesUserIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'userUnclaimedRewards',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.UserIncentiveData',
            name: 'vTokenIncentivesUserData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'tokenincentivesUserIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'userUnclaimedRewards',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'rewardTokenAddress',
                type: 'address',
              },
            ],
            internalType: 'struct IUiIncentiveDataProvider.UserIncentiveData',
            name: 'sTokenIncentivesUserData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProvider.UserReserveIncentiveData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
