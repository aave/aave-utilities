<p align="center"> <a href="https://aave.com/" rel="noopener" target="_blank"><img width="150" src="https://aave.com/static/media/ghostGradient.77808e40.svg" alt="Aave logo"></a></p>

<h1 align="center">Aave Utilities</h1>

Aave is a decentralized non-custodial liquidity market protocol where users can
participate as depositors or borrowers. The Aave Protocol is a set of open
source smart contracts which facilitate the supply and borrowing of user funds.
These contracts, and all user transactions/balances are stored on a public
ledger called a blockchain, making them accessible to anyone

This Aave utilities packages give developers access to methods for formatting
contract data and executing transactions on the Aave protocol, and is compatible
with both Aave V2 and V3

Aave Utilities is an upgrade to the existing
[aave-js](https://github.com/aave/aave-js) library, designed to be more modular,
efficient, and easier to use

<br />

## Installation

Aave utilities are available as npm packages,
[contract helpers](https://www.npmjs.com/package/@aave/contract-helpers), and
[math utils](https://www.npmjs.com/package/@aave/math-utils)

```sh
// with npm
npm install @aave/contract-helpers @aave/math-utils
// with yarn
yarn add @aave/contract-helpers @aave/math-utils
```

<br />

## Features

1.  [Data Formatting Methods](#data-formatting-methods)
    - a. [Fetching Protocol Data](#fetching-protocol-data)
      - [Smart Contract Calls](#smart-contract-calls)
      - [Subgraph](#subgraph)
      - [Caching Server](#caching-server)
    - b. [Format Reserve Data](#reserve-data)
      - [formatReserves](#formatReserves)
      - [formatReservesAndIncentives](#formatReservesAndIncentives)
    - c. [Format User Data](#user-data)
      - [formatUserSummary](#formatUserSummary)
      - [formatUserSummaryAndIncentives](#formatUserSummaryAndIncentives)
2.  [Transaction Methods](#transaction-methods)
    - a. [Provider Setup](#provider-setup)
    - b. [Pool V3](#pool-v3)
      - [supply](#supply)
      - [signERC20Approval](#signERC20Approval)
      - [supplyWithPermit](#supply-with-permit)
      - [borrow](#borrow-v3)
      - [repay](#repay-v3)
      - [repayWithATokens](#repayWithATokens)
      - [withdraw](#withdraw-v3)
      - [swapBorrowRateMode](#swapBorrowRateMode-v3)
      - [setUsageAsCollateral](#setUsageAsCollateral-v3)
      - [liquidationCall](#liquidationCall-v3)
      - [swapCollateral](#swapCollateral-v3)
      - [repayWithCollateral](#repayWithCollateral-v3)
      - [setUserEMode](#setUserEMode)
    - c. [Lending Pool V2](#lending-pool-v2)
      - [deposit](#deposit)
      - [borrow](#borrow)
      - [repay](#repay)
      - [withdraw](#withdraw)
      - [swapBorrowRateMode](#swapBorrowRateMode)
      - [setUsageAsCollateral](#setUsageAsCollateral)
      - [liquidationCall](#liquidationCall)
      - [swapCollateral](#swapCollateral)
      - [repayWithCollateral](#repayWithCollateral)
    - d. [Flashloans](#flashloans)
      - [V2](#flashloans-v2)
      - [V3](#flashloans-v3)
    - e. [Staking](#staking)
      - [stake](#stake)
      - [redeem](#redeem)
      - [cooldown](#cooldown)
      - [claimRewards](#claimRewards)
    - f. [Governance V2](#governancev2)
      - [Governance](#governance)
      - [create](#create)
      - [cancel](#cancel)
      - [queue](#queue)
      - [execute](#execute)
      - [submitVote](#submitVote)
      - [GovernanceDelegation](#governanceDelegation)
      - [delegate](#delegate)
      - [delegateByType](#delegateByType)
    - g. [Faucets](#faucets)
      - [mint](#mint)

<br />

# Data Formatting Methods

Users interact with the Aave protocol through a set of smart contracts. The
`@aave/math-utils` package is a collection of methods to take raw input data
from these contracts, and format to use on a frontend interface such as
[Aave UI](https://github.com/aave/aave-ui) or
[Aave info](https://github.com/sakulstra/info.aave)

## Fetching Protocol Data

Input data for these methods can be obtained in a variety of ways with some
samples below:

- [Contract Queries](#contract-queries)
- [Subgraph](#subgraph)
- [Caching Server](#caching-server)

<br />

### Contract Queries

There are a variety of libraries which can be used to query the Aave protocol
smart contract. The basic process is: you provide the library with an rpc URL
and TypeChain bindings which will generate a typed sdk for interacting with
contract data

The rpc endpoint is network-specific url will execute your requests to the
blockchain. The
[Aave UI networks config](https://github.com/aave/aave-ui/blob/master/src/ui-config/networks.ts)
gives a `publicJsonRPCUrl` for each supported network which can be used to make
requests **with** or **without** an API key.

The following code snippets can be used to fetch data which can be passed
directly into [data formatting methods](#data-formatting-methods):

- [ethers.js](#ethers.js)
- [web3.js](#web.js)
- [truffle](#truffle)

<br />

### ethers.js

[ethers.js](https://docs.ethers.io/v5/) is a library for interacting with
Ethereum and other EVM compatible blockchains. To install:

```sh
npm install --save ethers
```

The first step to query contract data with ethers is to inialize a `provider`,
there are a [variety](https://docs.ethers.io/v5/api/providers/) to choose from,
all of them requiring the an rpcURL

The sample code below includes an example of initializing a provider, and using
it query the helper contract data which can be passed directly into data
formatting methods.

<details>
	<summary>Sample Code</summary>

```ts
import { ethers } from 'ethers';
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
} from '@aave/contract-helpers';

// Sample RPC address for querying ETH mainnet
const provider = new ethers.provider.DefaultProvider(
  'https://cloudflare-eth.com',
);

// This is the provider used in Aave UI, it checks the chainId locally to reduce RPC calls with frequent network switches, but requires that the rpc url and chainId to remain consistent with the request being sent from the wallet (i.e. - detecting the active chainId)
const providerAlt = new ethers.providers.StaticJsonRpcProvider(
  'https://cloudflare-eth.com',
  ChainId.mainnet,
);

// Aave protocol contract addresses, will be different for each market and can be found at https://docs.aave.com/developers/deployed-contracts/deployed-contracts or https://github.com/aave/aave-ui/blob/master/src/ui-config/markets/index.ts
const uiPoolDataProviderAddress = '';
const uiIncentiveDataProviderAddress = '';
const lendingPoolAddressProvider = '';

// User address to fetch data for
const currentAccount = '';

// View contract used to fetch all reserves data (including market base currency data), and user reserves
const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress,
  provider,
});

// View contract used to fetch all reserve incentives (APRs), and user incentives
const incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress,
  provider,
});

// Object containing array of pool reserves and market base currency data
// { reservesArray, baseCurrencyData }
const reserves = await poolDataProviderContract.getReservesHumanized({
  lendingPoolAddressProvider,
});

// Object containing array or users aave positions and active eMode category
// { userReserves, userEmodeCategoryId }
const userReserves = await poolDataProviderContract.getUserReservesHumanized({
  lendingPoolAddressProvider,
  currentAccount,
});

// Array of incentive tokens with price feed and emission APR
const reserveIncentives =
  await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
    lendingPoolAddressProvider,
  });

// Dictionary of claimable user incentives
const userIncentives =
  await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
    lendingPoolAddressProvider,
    currentAccount,
  });
```

</details>

<br />

### web.js

<br />

### truffle

<br />

### Subgraph

A subgraph indexes events emitted from a smart contract and exposes a graphql
endpoing to query data from. Each network where the protocol is deployed is a
corresponding subgraph. Subgraph can be queried directly using the playground
(links below) and integrated into applications directly via TheGraph API. Check
out these guides from
[Aave](https://docs.aave.com/developers/getting-started/using-graphql) and
[TheGraph](https://thegraph.com/docs/en/developer/querying-from-your-app/) for
resources on querying subgraph from a frontend application.

Here are queries for fetching the data fields required for
[data formatting methods](#data-formatting-methods). The formatting methods are
the same for V2 and V3, but the queries required to fetch the input data are
different. The result will need to be formatted

<details>
	<summary>V2</summary>

```ts

```

</details>

<details>
	<summary>V3</summary>

```ts

```

</details>

<br />

### Caching Server

Given that the Aave Ui has decentralized hosting with IPFS, it makes sense to
not require any API keys to run the UI, but this means only public rpc endpoints
are used which are quickly rate limited. To account for this, Aave has publushed
a [caching server](https://github.com/aave/aave-ui-caching-server) to perform
contract queries on one server, then serve this data to all frontend users
through a graphQL endpoint.

The four queries to fetch input data (in both query and subscription form) are
located
[here](https://github.com/aave/aave-ui/tree/master/src/libs/caching-server-data-provider/graphql)
in the follow files:

- protocol-data.graphql
- user-data.graphql
- incentives-data.graphql
- user-incentives-data.graphql

Examples of hooks for fetching data with these queries are located
[here](https://github.com/aave/aave-ui/tree/master/src/libs/caching-server-data-provider/hooks).

<br />

## Reserve Data

Formatted reserve data is an array of tokens in the Aave market, including
supply, borrow rates, configuration,

### formatReserves

Description

<details>
  <summary>Parameters</summary>

```ts
- @param `reserves` - Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
- @param `currentTimestamp` - Current UNIX timestamp in seconds
- @param `marketReferencePriceInUsd` - Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` - Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
```

</details>

<details>
  <summary>Sample Code</summary>

```ts
import { formatReserves } from '@aave/math-utils';

// reserves input from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;

const currentTimestamp = Math.round(new Date().getTime() / 1000);

const formattedPoolReserves = formatReserves({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
});
```

</details>

<br />

### formatReservesAndIncentives

<details>
  <summary>Parameters</summary>

```ts
- @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
```

</details>

<details>
  <summary>Sample Code</summary>

```ts
import { formatReservesAndIncentives } from '@aave/math-utils';

// 'reserves' and 'reserveIncentives' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;

const currentTimestamp = Math.round(new Date().getTime() / 1000);

const formattedPoolReserves = formatReservesAndIncentives({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  reserveIncentives,
});
```

</details>

<br />

## User Data

Description

### formatUserSummary

Returns formatted summary of Aave user portfolio including: array of holdings,
total liquidity, total collateral, total borrows, liquidation threshold, health
factor, and available borrowing power.

<details>
  <summary>Parameters</summary>

```ts
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
- @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
```

</details>

<details>
  <summary>Sample Code</summary>

```ts
import { formatUserSummary } from '@aave/math-utils';

// 'reserves' and 'userReserves' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;
const userReservesArray = userReserves.userReserves;

const currentTimestamp = Math.round(new Date().getTime() / 1000);

// Combine reserve data with user data
const userReservesFormatted: UserReserveData[] = [];
if (userReservesArray && reservesArray.length) {
  userReservesArray.forEach(rawUserReserve => {
    const reserve = reservesArray.find(
      r =>
        r.underlyingAsset.toLowerCase() ===
        rawUserReserve.underlyingAsset.toLowerCase(),
    );
    if (reserve) {
      userReservesFormatted.push({
        ...rawUserReserve,
        reserve,
      });
    }
  });
}

const userSummary = formatUserSummaryAndIncentives({
  currentTimestamp,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  userReserves: userReservesFormatted,
  userEmodeCategoryId: userReserves.userEmodeCategoryId,
});
```

</details>

<br />

### formatUserSummaryAndIncentives

Returns formatted summary of Aave user portfolio including: array of holdings,
total liquidity, total collateral, total borrows, liquidation threshold, health
factor, available borrowing power, and dictionary of claimable incentives

<details>
  <summary>Parameters</summary>

```ts
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
- @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
- @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
- @param `userIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `userIncentives`
```

</details>

<details>
  <summary>Sample Code</summary>

```ts
// 'reserves', 'userReserves', 'reserveIncentives', and 'userIncentives' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;
const userReservesArray = userReserves.userReserves;

const currentTimestamp = Math.round(new Date().getTime() / 1000);

// Combine reserve data with user data
const userReservesFormatted: UserReserveData[] = [];
if (userReservesArray && reservesArray.length) {
  userReservesArray.forEach(rawUserReserve => {
    const reserve = reservesArray.find(
      r =>
        r.underlyingAsset.toLowerCase() ===
        rawUserReserve.underlyingAsset.toLowerCase(),
    );
    if (reserve) {
      userReservesFormatted.push({
        ...rawUserReserve,
        reserve,
      });
    }
  });
}

const userSummary = formatUserSummaryAndIncentives({
  currentTimestamp,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  userReserves: userReservesFormatted,
  userEmodeCategoryId: userReserves.userEmodeCategoryId,
  reserveIncentives,
  userIncentives,
});
```

</details>

<br />

# Transaction Methods

## Markets and Networks

The library exports the enabled networks and markets in the Aave protocol as the
enums `Network` and `Market`

```ts
import { Network, Market } from '@aave/contract-helpers';
```

## Usage

```ts
import { TxBuilderV2, Network, Market } from '@aave/protocol-js';

const httpProvider = new Web3.providers.HttpProvider(
  process.env.ETHEREUM_URL || 'https://kovan.infura.io/v3/<project_id>',
);
const txBuilder = new TxBuilderV2(Network.main, httpProvider);

lendingPool = txBuilder.getLendingPool(Market.main); // get all lending pool methods
```

## Providers

The library accepts 3 kinds of providers:

- web3 provider
- JsonRPC url
- no provider: if no provider is passed it will default to ethers Infura /
  etherscan providers (shared providers, do not use in production)

To learn more about supported providers, see the
[ethers documentation on providers](https://docs.ethers.io/v5/api/providers/#providers).

## Lending Pool V2

Object that contains all the necessary methods to create Aave lending pool
transactions.

The return object will be a Promise array of objects of type:

`ts import { EthereumTransactionTypeExtended } from '@aave/protocol-js' `

having {tx, txType}

- tx: object with transaction fields. - txType: string determining the kinds of
  transaction.

### deposit

Deposits the underlying asset into the reserve. A corresponding amount of the
overlying asset (aTokens) is minted.

- @param `user` The ethereum address that will make the deposit - @param
  `reserve` The ethereum address of the reserve - @param `amount` The amount to
  be deposited - @param @optional `onBehalfOf` The ethereum address for which
  user is depositing. It will default to the user address - @param @optional
  `referralCode` Integrators are assigned a referral code and can potentially
  receive rewards. It defaults to 0 (no referrer)

`ts lendingPool.deposit({ user, // string, reserve, // string, amount, // string, onBehalfOf, // ? string, referralCode, // ? string, }); `

If the `user` is not approved, an approval transaction will also be returned.

### borrow

Borrow an `amount` of `reserve` asset.

User must have a collaterised position (i.e. aTokens in their wallet)

- @param `user` The ethereum address that will receive the borrowed amount -
  @param `reserve` The ethereum address of the reserve asset - @param `amount`
  The amount to be borrowed, in human readable units (e.g. 2.5 ETH) - @param
  `interestRateMode` Whether the borrow will incur a stable or variable interest
  rate (1 | 2) - @param @optional `debtTokenAddress` The ethereum address of the
  debt token of the asset you want to borrow. Only needed if the reserve is ETH
  mock address - @param @optional `onBehalfOf` The ethereum address for which
  user is borrowing. It will default to the user address - @param @optional
  `refferalCode` Integrators are assigned a referral code and can potentially
  receive rewards. It defaults to 0 (no referrer)

````ts enum InterestRate { None = 'None', Stable = 'Stable', Variable = 'Variable', }

lendingPool.borrow({ user, // string, reserve, // string, amount, // string, interestRateMode, // InterestRate; debtTokenAddress, // ? string; onBehalfOf, // ? string; referralCode, // ? string; }); ```

### repay

Repays a borrow on the specific reserve, for the specified amount (or for the whole amount, if (-1) is specified). the target user is defined by `onBehalfOf`. If there is no repayment on behalf of another account, `onBehalfOf` must be equal to `user`.

- @param `user` The ethereum address that repays - @param `reserve` The ethereum address of the reserve on which the user borrowed - @param `amount` The amount to repay, or (-1) if the user wants to repay everything - @param `interestRateMode` Whether the borrow will incur a stable or variable interest rate (1 | 2) - @param @optional `onBehalfOf` The ethereum address for which user is repaying. It will default to the user address

```ts  enum InterestRate { None = 'None', Stable = 'Stable', Variable = 'Variable', }

lendingPool.repay({ user, // string, reserve, // string, amount, // string, interestRateMode, // InterestRate; onBehalfOf, // ? string }); ```

If the `user` is not approved, an approval transaction will also be returned.

### withdraw

Withdraws the underlying asset of an aToken asset.

- @param `user` The ethereum address that will receive the aTokens - @param `reserve` The ethereum address of the reserve asset - @param `amount` The amount of aToken being redeemed - @param @optional `aTokenAddress` The ethereum address of the aToken. Only needed if the reserve is ETH mock address - @param @optional `onBehalfOf` The amount of aToken being redeemed. It will default to the user address

```ts  lendingPool.withdraw({ user, // string, reserve, // string, amount, // string, aTokenAddress, // ? string, onBehalfOf, // ? string }); ```

### swapBorrowRateMode

Borrowers can use this function to swap between stable and variable borrow rate modes.

- @param `user` The ethereum address that wants to swap rate modes - @param `reserve` The address of the reserve on which the user borrowed - @param `interestRateMode` Whether the borrow will incur a stable or variable interest rate (1 | 2)

```ts  enum InterestRate { None = 'None', Stable = 'Stable', Variable = 'Variable', }

lendingPool.swapBorrowRateMode({ user, // string, reserve, // string, interestRateMode, // InterestRate; }); ```

### setUsageAsCollateral

Allows depositors to enable or disable a specific deposit as collateral.

- @param `user` The ethereum address that enables or disables the deposit as collateral - @param `reserve` The ethereum address of the reserve - @param `useAsCollateral` True if the user wants to use the deposit as collateral, false otherwise.

```ts  lendingPool.setUsageAsCollateral({ user, // string, reserve, // string, usageAsCollateral, // boolean }); ```

### liquidationCall

Users can invoke this function to liquidate an undercollateralized position.

- @param `liquidator` The ethereum address that will liquidate the position - @param `liquidatedUser` The address of the borrower - @param `debtReserve` The ethereum address of the principal reserve - @param `collateralReserve` The address of the collateral to liquidated - @param `purchaseAmount` The amount of principal that the liquidator wants to repay - @param @optional `getAToken` Boolean to indicate if the user wants to receive the aToken instead of the asset. Defaults to false

```ts  lendingPool.liquidationCall({ liquidator, // string; liquidatedUser, // string; debtReserve, // string; collateralReserve, // string; purchaseAmount, // string; getAToken, // ? boolean; }); ```

### swapCollateral

Allows users to swap a collateral to another asset

- @param `user` The ethereum address that will liquidate the position - @param @optional `flash` If the transaction will be executed through a flasloan(true) or will be done directly through the adapters(false). Defaults to false - @param `fromAsset` The ethereum address of the asset you want to swap - @param `fromAToken` The ethereum address of the aToken of the asset you want to swap - @param `toAsset` The ethereum address of the asset you want to swap to (get) - @param `fromAmount` The amount you want to swap - @param `toAmount` The amount you want to get after the swap - @param `maxSlippage` The max slippage that the user accepts in the swap - @param @optional `permitSignature` A permit signature of the tx. Only needed when previously signed (Not needed at the moment). - @param `swapAll` Bool indicating if the user wants to swap all the current collateral - @param @optional `onBehalfOf` The ethereum address for which user is swaping. It will default to the user address - @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer) - @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false

```ts  type PermitSignature = { amount: tStringCurrencyUnits; deadline: string; v: number; r: BytesLike; s: BytesLike; };

await lendingPool.swapCollateral({ user, // string; flash, // ? boolean; fromAsset, // string; fromAToken, // string; toAsset, // string; fromAmount, // string; toAmount, // string; maxSlippage, // string; permitSignature, // ? PermitSignature; swapAll, // boolean; onBehalfOf, // ? string; referralCode, // ? string; useEthPath, // ? boolean; }); ```

### repayWithCollateral

Allows a borrower to repay the open debt with the borrower collateral

- @param `user` The ethereum address that will liquidate the position - @param `fromAsset` The ethereum address of the asset you want to repay with (collateral) - @param `fromAToken` The ethereum address of the aToken of the asset you want to repay with (collateral) - @param `assetToRepay` The ethereum address of the asset you want to repay - @param `repayWithAmount` The amount of collateral you want to repay the debt with - @param `repayAmount` The amount of debt you want to repay - @param `permitSignature` A permit signature of the tx. Optional - @param @optional `repayAllDebt` Bool indicating if the user wants to repay all current debt. Defaults to false - @param `rateMode` Enum indicating the type of the interest rate of the collateral - @param @optional `onBehalfOf` The ethereum address for which user is swaping. It will default to the user address - @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer) - @param @optional `flash` If the transaction will be executed through a flasloan(true) or will be done directly through the adapters(false). Defaults to false - @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false

```ts  enum InterestRate { None = 'None', Stable = 'Stable', Variable = 'Variable', }

await lendingPool.repayWithCollateral({ user, // string; fromAsset, // string; fromAToken, // string; assetToRepay, // string repayWithAmount, // string; repayAmount, // string; permitSignature, // ? PermitSignature; repayAllDebt, // ? boolean; rateMode, // InterestRate; onBehalfOf, // ? string; referralCode, // ? string; flash, // ? boolean; useEthPath, // ? boolean; }); ```

## Flashloans

### V2 Flashloans
### V3 Flashloans

## Governance V2

Example of how to use the governance service

```ts  import { TxBuilderV2, AaveGovernanceV2Interface, GovernanceDelegationTokenInterface, } from '@aave/protocol-js';

const httpProvider = new Web3.providers.HttpProvider( process.env.ETHEREUM_URL || "https://kovan.infura.io/v3/<project_id>" ); const txBuilder = new TxBuilderV2(Network.main, httpProvider); const gov2 = txBuilder.aaveGovernanceV2Service; const powerDelegation = txBuilder.governanceDelegationTokenService; ```

### create

Creates a Proposal (needs to be validated by the Proposal Validator)

- @param `user` The ethereum address that will create the proposal - @param `targets` list of contracts called by proposal's associated transactions - @param `values` list of value in wei for each propoposal's associated transaction - @param `signatures` list of function signatures (can be empty) to be used when created the callData - @param `calldatas` list of calldatas: if associated signature empty, calldata ready, else calldata is arguments - @param `withDelegatecalls` boolean, true = transaction delegatecalls the taget, else calls the target - @param `ipfsHash` IPFS hash of the proposal - @param `executor` The ExecutorWithTimelock contract that will execute the proposal

```ts  enum ExecutorType { Short, Long, }

--------

gov2.create({ user. // string; targets, //string[]; values, // string[]; signatures, // string[]; calldatas, // BytesLike[]; withDelegateCalls, // boolean[]; ipfsHash, // BytesLike; executor, // ExecutorType; }); ```

### cancel

Cancels a Proposal. Callable by the \_guardian with relaxed conditions, or by anybody if the conditions of cancellation on the executor are fulfilled

- @param `user` The ethereum address that will create the proposal - @param `proposalId` Id of the proposal we want to cancel

```ts  gov2.cancel({ user, // string proposalId, // number }) ```

### queue

Queue the proposal (If Proposal Succeeded)

- @param `user` The ethereum address that will create the proposal - @param `proposalId` Id of the proposal we want to queue

```ts  gov2.queue({ user, // string proposalId, // number }) ```

### execute

Execute the proposal (If Proposal Queued)

- @param `user` The ethereum address that will create the proposal - @param `proposalId` Id of the proposal we want to execute

```ts  gov2.execute({ user, // string proposalId, // number }) ```

### submitVote

Function allowing msg.sender to vote for/against a proposal

- @param `user` The ethereum address that will create the proposal - @param `proposalId` Id of the proposal we want to vote - @param `support` Bool indicating if you are voting in favor (true) or against (false)

```ts  gov2.submitVote({ user, // string proposalId, // number support, // boolean }) ```

## Governance Delegation

### delegate

Method for the user to delegate voting `and` proposition power to the chosen address

- @param `user` The ethereum address that will create the proposal - @param `delegatee` The ethereum address to which the user wants to delegate proposition power and voting power - @param `governanceToken` The ethereum address of the governance token

```ts  powerDelegation.delegate({ user, // string delegatee, // string governanceToken // string }); ```

### delegateByType

Method for the user to delegate voting `or` proposition power to the chosen address

- @param `user` The ethereum address that will create the proposal - @param `delegatee` The ethereum address to which the user wants to delegate proposition power and voting power - @param `delegationType` The type of the delegation the user wants to do: voting power ('0') or proposition power ('1') - @param `governanceToken` The ethereum address of the governance token

```ts  powerDelegation.delegateByType({ user, // string delegatee, // string delegationType, // string governanceToken // string }); ```

## Faucets

To use the testnet faucets which are compatible with Aave:

```ts  import { TxBuilderV2, Network, Market } from '@aave/protocol-js'

const httpProvider = new Web3.providers.HttpProvider( process.env.ETHEREUM_URL || "https://kovan.infura.io/v3/<project_id>" ); const txBuilder = new TxBuilderV2(Network.main, httpProvider); const faucet = txBuilder.faucetService; ```

### mint

Mint tokens for the usage on the Aave protocol on the Kovan network. The amount of minted tokens is fixed and depends on the token

- @param `userAddress` The ethereum address of the wallet the minted tokens will go - @param `reserve` The ethereum address of the token you want to mint - @param `tokenSymbol` The symbol of the token you want to mint

```ts  faucet.mint({ userAddress, // string reserve, // string tokenSymbol, // string }); ```

## Usage

Here is a quick example to get you started:

```ts import { PermissionManager } from '@aave/contract-helpers';

const instance = new PermissionManager({ provider: rpcProvider, permissionManagerAddress: permissionManagerAddress, }); const permissions = await instance.getHumanizedUserPermissions(walletAddress); ```
````
