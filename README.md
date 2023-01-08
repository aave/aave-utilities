<p align="center"> <a href="https://aave.com/" rel="noopener" target="_blank"><img width="150" src="https://aave.com/static/media/ghostGradient.77808e40.svg" alt="Aave logo"></a></p>

<h1 align="center">Aave Utilities</h1>

The Aave Protocol is a decentralized non-custodial liquidity protocol
where users can participate as suppliers or borrowers. The protocol is a set of
open source smart contracts which facilitate the logic of user interactions. 
These contracts, and all user transactions/balances are stored on a
public ledger called a blockchain, making them accessible to anyone

Aave Utilities is a JavaScript SDK for interacting with V2 and V3 of the Aave
Protocol, an upgrade to the existing [aave-js](https://github.com/aave/aave-js)
library

The `@aave/math-utils` package contains methods for formatting raw
([ethers.js](#ethers.js)) or indexed ([subgraph](#subgraph),
[caching server](#caching-server)) contract data for usage on a frontend

The `@aave/contract-helpers` package contains methods for generating transactions
based on method and parameter inputs. Can be used to read and write data on the
protocol contracts.

<br />

## Installation

Aave utilities are available as npm packages,
[contract helpers](https://www.npmjs.com/package/@aave/contract-helpers) and
[math utils](https://www.npmjs.com/package/@aave/math-utils)

[ethers v5](https://docs.ethers.io/v5/) and [reflect-metadata](reflect metadata)
are peer dependencies of the contract-helpers package

```sh
// with npm
npm install --save-dev ethers reflect-metadata
npm install @aave/contract-helpers @aave/math-utils

// with yarn
yarn add --dev ethers reflect-metadata
yarn add @aave/contract-helpers @aave/math-utils
```

<br />

## Features

1.  [Data Formatting Methods](#data-formatting-methods)
    - a. [Fetching Protocol Data](#fetching-protocol-data)
      - [ethers](#ethersjs)
      - [Subgraph](#subgraph)
      - [Caching Server](#caching-server)
    - b. [Format Reserve Data](#reserve-data)
      - [formatReserves](#formatReserves)
      - [formatReservesAndIncentives](#formatReservesAndIncentives)
    - c. [Format User Data](#user-data)
      - [formatUserSummary](#formatUserSummary)
      - [formatUserSummaryAndIncentives](#formatUserSummaryAndIncentives)
2.  [Transaction Methods](#transaction-methods)
    - a. [Submitting Transactions](#submitting-transactions)
    - b. [Pool V3](#pool-v3)
      - [supply](#supply)
      - [signERC20Approval](#signERC20Approval)
      - [supplyWithPermit](#supply-with-permit)
      - [borrow](<#borrow-(v3)>)
      - [repay](<#repay-(v3)>)
      - [repayWithPermit](#repayWithPermit)
      - [repayWithATokens](#repayWithATokens)
      - [withdraw](<#withdraw-(v3)>)
      - [swapBorrowRateMode](<#swapBorrowRateMode-(v3)>)
      - [setUsageAsCollateral](<#setUsageAsCollateral-(v3)>)
      - [liquidationCall](<#liquidationCall-(v3)>)
      - [swapCollateral](<#swapCollateral-(v3)>)
      - [repayWithCollateral](<#repayWithCollateral-(v3)>)
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
    - d. [Staking](#staking)
      - [stake](#stake)
      - [redeem](#redeem)
      - [cooldown](#cooldown)
      - [claimRewards](#claimRewards)
    - e. [Governance V2](#governancev2)
      - [create](#create)
      - [cancel](#cancel)
      - [queue](#queue)
      - [execute](#execute)
      - [submitVote](#submitVote)
      - [delegate](#delegate)
      - [delegateByType](#delegateByType)
    - f. [Faucets](#faucets)
      - [mint](#mint)
    - g. [Credit Delegation](#credit-delegation)
      - [approveDelegation](#approveDelegation)

<br />

# Data Formatting Methods

Users interact with the Aave protocol through a set of smart contracts. The
`@aave/math-utils` package is a collection of methods to take raw input data
from these contracts, and format to use on a frontend interface such as
[Aave Ui](https://github.com/aave/aave-ui) or
[Aave info](https://github.com/sakulstra/info.aave)

## Fetching Protocol Data

Input data for these methods can be obtained in a variety of ways with some
samples below:

- [ethers](#ethers.js)
- [Subgraph](#subgraph)
- [Caching Server](#caching-server)

<br />

### ethers.js

[ethers.js](https://docs.ethers.io/v5/) is a library for interacting with
Ethereum and other EVM compatible blockchains. To install:

The first step to query contract data with ethers is to initialize a `provider`,
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
const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-mainnet.alchemyapi.io/v2/demo',
);

// This is the provider used in Aave UI, it checks the chainId locally to reduce RPC calls with frequent network switches, but requires that the rpc url and chainId to remain consistent with the request being sent from the wallet (i.e. actively detecting the active chainId)
const provider = new ethers.providers.StaticJsonRpcProvider(
  'https://eth-mainnet.alchemyapi.io/v2/demo',
  ChainId.mainnet,
);

// Aave protocol contract addresses, will be different for each market and can be found at https://docs.aave.com/developers/deployed-contracts/deployed-contracts
// For V3 Testnet Release, contract addresses can be found here https://github.com/aave/aave-ui/blob/feat/arbitrum-clean/src/ui-config/markets/index.ts
const uiPoolDataProviderAddress = '0xa2DC1422E0cE89E1074A6cd7e2481e8e9c4415A6';
const uiIncentiveDataProviderAddress =
  '0xD01ab9a6577E1D84F142e44D49380e23A340387d';
const lendingPoolAddressProvider = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';

// User address to fetch data for
const currentAccount = '';

// View contract used to fetch all reserves data (including market base currency data), and user reserves
const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress,
  provider,
  chainId: ChainId.mainnet,
});

// View contract used to fetch all reserve incentives (APRs), and user incentives
const incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress,
  provider,
  chainId: ChainId.mainnet,
});

// Note, contract calls should be performed in an async block, and updated on interval or on network/market change

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

These four variables are passed as parameters into the [reserve](#reserve-data)
and [user](#user-data) formatters to compute all of the fields needed for a
frontend interface.

</details>

<br />

### Subgraph

A subgraph indexes events emitted from a smart contract and exposes a graphql
endpoint to query data from. Each network where the protocol is deployed is a
corresponding subgraph. Subgraph can be queried directly using the playground
(links below) and integrated into applications directly via TheGraph API. Check
out these guides from
[Aave](https://docs.aave.com/developers/getting-started/using-graphql) and
[TheGraph](https://thegraph.com/docs/en/developer/querying-from-your-app/) for
resources on querying subgraph from a frontend application.

Here are queries for fetching the data fields required for
[data formatting methods](#data-formatting-methods). The formatting methods are
the same for V2 and V3, but the queries required to fetch the input data are
different. Queries will depend on two parameters:

- `pool` : lendingPoolAddressProvider address for the market you are querying
  data for
- `user` : user to fetch account data for

<details>
	<summary>V2</summary>

  <details>
    <summary>Reserves</summary>

```graphql
{
  reserves(
    where: { pool: "insert_lowercase_lending_pool_address_provider_here" }
  ) {
    id
    symbol
    name
    decimals
    underlyingAsset
    usageAsCollateralEnabled
    reserveFactor
    baseLTVasCollateral
    averageStableRate
    stableDebtLastUpdateTimestamp
    liquidityIndex
    reserveLiquidationThreshold
    reserveLiquidationBonus
    variableBorrowIndex
    variableBorrowRate
    liquidityRate
    totalPrincipalStableDebt
    totalScaledVariableDebt
    lastUpdateTimestamp
    availableLiquidity
    stableBorrowRate
    totalLiquidity
    price {
      priceInEth
    }
  }
}
```

Then formatted to match expected input schema with:

```ts
const reserves = queryResult.reserves.map(reserve => {
  return {
    ...reserve,
    priceInMarketReferenceCurrency: reserve.price.priceInEth,
    eModeCategoryId: 0,
    borrowCap: '',
    supplyCap: '',
    debtCeiling: '',
    debtCeilingDecimals: 0,
    isolationModeTotalDebt: '',
    eModeLtv: 0,
    eModeLiquidationThreshold: 0,
    eModeLiquidationBonus: 0,
  };
});
```

  </details>

  <details>
    <summary>User Reserves</summary>

```graphql
{
  userReserves(where: {pool: "insert_lowercase_lending_pool_address_provider_here", user: "insert_lowercase_user_address_here"}) {
    reserve{
      underlyingAsset
    }
    scaledATokenBalance
    usageAsCollateralEnabledOnUser
    stableBorrowRate
    scaledVariableDebt
    principalStableDebt
    stableBorrowLastUpdateTimestamp
  }
  }
}
```

Then formatted to match expected input schema with:

```ts
const userReserves = queryResults.userReserves.map(userReserve => {
  return {
    ...userReserve,
    underlyingAsset: userReserve.reserve.underlyingAsset,
  };
});
```

The `userEmodeCategoryId` parameter will always be 0 for V2 markets.

  </details>

  <details>
    <summary>Base Currency Data</summary>

```graphql
{
  priceOracles {
    usdPriceEth
  }
}
```

For ETH-based markets (all V2 markets except Avalanche):

- `marketReferencePriceInUsd` = 1 / (queryResult.priceOracles[0].usdPriceEth /
  (10 \*\* 18))

- `marketReferenceCurrencyDecimals` = 18

For USD-based markets (Avalanche and all v3 markets):
    
- `marketReferencePriceInUsd` = "100000000"

- `marketReferenceCurrencyDecimals` = 8

  </details>

  <details>
    <summary>Incentives</summary>

Samples for incentives data coming soon. Uses `incentivesControlllers` field and
maps incentives to reserves and userReserves.

  </details>

</details>

<details>
	<summary>V3</summary>

  <details>
    <summary>Reserves</summary>

```graphql
{
  reserves(
    where: { pool: "insert_lowercase_lending_pool_address_provider_here" }
  ) {
    id
    symbol
    name
    decimals
    underlyingAsset
    usageAsCollateralEnabled
    reserveFactor
    baseLTVasCollateral
    averageStableRate
    stableDebtLastUpdateTimestamp
    liquidityIndex
    reserveLiquidationThreshold
    reserveLiquidationBonus
    variableBorrowIndex
    variableBorrowRate
    liquidityRate
    totalPrincipalStableDebt
    totalScaledVariableDebt
    lastUpdateTimestamp
    availableLiquidity
    stableBorrowRate
    totalLiquidity
    price {
      priceInEth
    }
    eModeCategoryId
    borrowCap
    supplyCap
    debtCeiling
    debtCeilingDecimals
    isolationModeTotalDebt
    eModeLtv
    eModeLiquidationThreshold
    eModeLiquidationBonus
  }
}
```

Then formatted to match expected input schema with:

```ts
const reserves = queryResults.map(queryResult => {
  return {
    ...queryResult,
    priceInMarketReferenceCurrency: queryResult.price.priceInEth,
  };
});
```

  </details>

  <details>
    <summary>User Reserves</summary>

```graphql
{
  userReserves(
    where: {
      pool: "insert_lowercase_lending_pool_address_provider_here"
      user: "insert_lowercase_user_address_here"
    }
  ) {
    reserve {
      underlyingAsset
    }
    scaledATokenBalance
    usageAsCollateralEnabledOnUser
    stableBorrowRate
    scaledVariableDebt
    principalStableDebt
    stableBorrowLastUpdateTimestamp
    user {
      eModeCategoryId {
        id
      }
    }
  }
}
```

Then formatted to match expected input schema with:

```ts
const userReserves = queryResults.map(queryResult => {
  return {
    ...queryResult,
    underlyingAsset: queryResult.reserve.underlyingAsset,
  };
});
```

The field `queryResults[0].user.eModeCategoryId.id` is the active eModeCategory
and will input to the user formatters separately.

  </details>

  <details>
    <summary>Base Currency Data</summary>
    
All V3 market use USD based oracles, so baseCurrencyData can be hardcoded:

- `marketReferencePriceInUsd` = "100000000"

- `marketReferenceCurrencyDecimals` = 8

  </details>

<details>
    <summary>Incentives</summary>

Samples for incentives data coming soon. Uses `incentivesControllers` field and
maps incentives to reserves and userReserves.

</details>

</details>

<br />

### Caching Server

Given that the Aave Ui has decentralized hosting with IPFS, it makes sense to
not require any API keys to run the UI, but this means only public rpc endpoints
are used which are quickly rate limited. To account for this, Aave has published
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

Formatted reserve data is an array of tokens in the Aave market, containing
realtime, human-readable data above asset configuration (maxLtv,
liquidationThreshold, usageAsCollateral, etc.) and current status (rates,
liquidity, utilization, etc.)

There are two formatter functions, one with incentives data and one without.
Both require input data from the
[fetching protocol data](#fetching-protocol-data) section

### formatReserves

formatReserves returns an array of formatted configuration and status data for
each reserve in an Aave market

<details>
  <summary>Sample Code</summary>

```ts
import { formatReserves } from '@aave/math-utils';
import dayjs from 'dayjs';

// reserves input from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;

const currentTimestamp = dayjs().unix();

/*
- @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
- @param `currentTimestamp` Current UNIX timestamp in seconds
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
*/
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

formatReservesAndIncentives returns an array of formatted configuration and
status data plus an object with supply, variable borrow, and stable borrow
incentives for each reserve in an Aave market

<details>
  <summary>Sample Code</summary>

```ts
import { formatReservesAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';

// 'reserves' and 'reserveIncentives' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;

const currentTimestamp = dayjs().unix();

/*
- @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
*/
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

Formatted user data is an object containing cumulative metrics (healthFactor,
totalLiquidity, totalBorrows, etc.) and an array of formatted reserve data plus
user holdings (aTokens, debtTokens) for each reserve in an Aave market

### formatUserSummary

Returns formatted summary of Aave user portfolio including: array of holdings,
total liquidity, total collateral, total borrows, liquidation threshold, health
factor, and available borrowing power

<details>
  <summary>Sample Code</summary>

```ts
import { formatUserSummary } from '@aave/math-utils';
import dayjs from 'dayjs';

// 'reserves' and 'userReserves' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;
const userReservesArray = userReserves.userReserves;

const currentTimestamp = dayjs().unix();

const formattedPoolReserves = formatReserves({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
});

/*
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
- @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
*/
const userSummary = formatUserSummary({
  currentTimestamp,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  userReserves: userReservesArray,
  formattedReserves,
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
  <summary>Sample Code</summary>

```ts
import { formatUserSummaryAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';

// 'reserves', 'userReserves', 'reserveIncentives', and 'userIncentives' inputs from Fetching Protocol Data section

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;
const userReservesArray = userReserves.userReserves;

const currentTimestamp = dayjs().unix();

const formattedPoolReserves = formatReserves({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
});

/*
- @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
- @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
- @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
- @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
- @param `userIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `userIncentives`
*/
const userSummary = formatUserSummaryAndIncentives({
  currentTimestamp,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  userReserves: userReservesArray,
  formattedReserves,
  userEmodeCategoryId: userReserves.userEmodeCategoryId,
  reserveIncentives,
  userIncentives,
});
```

</details>

<br />

# Transaction Methods

The transaction methods package provides an sdk to interact with Aave Protocol
contracts. See [ethers.js](#ethers.js) for instructions on installing setting up
and ethers provider

Once initialized this sdk can be used to generate the transaction data needed to
perform an action. If an approval is required, the method will return an array
with two transactions, or single transaction if no approval is needed.

## Submitting Transactions

All transaction methods will return an array of transaction objects of this
type:

```ts
import { EthereumTransactionTypeExtended } from '@aave/contract-helpers';
```

To send a transaction from this object:

```ts
import { BigNumber, providers } from 'ethers';

function submitTransaction({
  provider: providers.Web3Provider,  // Signing transactions requires a wallet provider, Aave UI currently uses web3-react (https://github.com/NoahZinsmeister/web3-react) for connecting wallets and accessing the wallet provider
  tx: EthereumTransactionTypeExtended
}){
  const extendedTxData = await tx.tx();
  const { from, ...txData } = extendedTxData;
  const signer = provider.getSigner(from);
  const txResponse = await signer.sendTransaction({
    ...txData,
    value: txData.value ? BigNumber.from(txData.value) : undefined,
  });
}
```

## Pool V3

Transaction methods to perform actions on the V3 Pool contract

### supply

Formerly `deposit`, supply the underlying asset into the Pool reserve. For every
token that is supplied, a corresponding amount of aTokens is minted

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await pool.supply({
  user,
  reserve,
  amount,
  onBehalfOf,
});

// If the user has not approved the pool contract to spend their tokens, txs will also contain two transactions: approve and supply. These approval and supply transactions can be submitted just as in V2,OR you can skip the first approval transaction with a gasless signature by using signERC20Approval -> supplyWithPermit which are documented below

// If there is no approval transaction, then supply() can called without the need for an approval or signature
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### signERC20Approval

This method is used to generate the raw signature data to be signed by the user.
Once generated, a function is called to trigger a signature request from the
users wallet. This signature can be passed a parameter to `supplyWithPermit` or
`repayWithPermit` in place of an approval transaction.

Note: Not all tokens are compatible with the ERC-2612 permit functionality. You
can check the
<a href="https://github.com/aave/interface/blob/main/src/ui-config/permitConfig.ts" target="_blank">Aave
interface config</a> for an updated list of supported tokens by network.

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `deadline` Expiration of signature in seconds, for example, 1 hour = Math.floor(Date.now() / 1000 + 3600).toString()
*/
const dataToSign: string = await pool.signERC20Approval({
  user,
  reserve,
  amount,
  deadline
});

const signature = await provider.send('eth_signTypedData_v4', [
  currentAccount,
  dataToSign,
]);

// This signature can now be passed into the supplyWithPermit() function below
```

</details>

<br />

### supplyWithPermit

Same underlying method as `supply` but uses a signature based approval passed as
a parameter.

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `signature` Signature approving Pool to spend user funds, received from signing output data of signERC20Approval()
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
  user,
  reserve,
  amount,
  signature,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### borrow (V3)

Borrow an `amount` of `reserve` asset.

User must have a collateralized position (i.e. aTokens in their wallet)

<details>
  <summary>Sample Code</summary>

```ts
import { Pool, InterestRate } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that repays 
- @param `reserve` The ethereum address of the reserve on which the user borrowed
- @param `amount` The amount to repay, or (-1) if the user wants to repay everything
- @param `interestRateMode` // Whether the borrow will incur a stable (InterestRate.Stable) or variable (InterestRate.Variable) interest rate
- @param @optional `onBehalfOf` The ethereum address for which user is repaying. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = pool.Borrow({
  user,
  reserve,
  amount,
  interestRateMode,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### repay (V3)

Repays a borrow on the specific reserve, for the specified amount (or for the
whole amount, if (-1) is specified). the target user is defined by `onBehalfOf`.
If there is no repayment on behalf of another account, `onBehalfOf` must be
equal to `user`

If the Pool is not approved to spend `user` funds, an approval transaction will
also be returned

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `interestRateMode` // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await pool.repay({
  user,
  reserve,
  amount,
  interestRateMode,
  onBehalfOf,
});

// If the user has not approved the pool contract to spend their tokens, txs will also contain two transactions: approve and repay. This approval transaction can be submitted just as in V2, OR you approve with a gasless signature by using signERC20Approval -> supplyWithPermit which are documented below

// If there is no approval transaction, then repay() can called without the need for an approval or signature
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### repayWithPermit

Same underlying method as `repay` but uses a signature based approval passed as
a parameter.

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `signature` Signature approving Pool to spend user funds, from signERC20Approval()
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
  user,
  reserve,
  amount,
  signature,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### repayWithATokens

Repays a borrow on the specific reserve, for the specified amount, deducting
funds from a users aToken balance instead of the underlying balance. To repay
the max debt amount or max aToken balance without dust (whichever is lowest),
set the amount to -1

There is no need for an approval or signature when repaying with aTokens

<details>
  <summary>Sample Code</summary>

```ts
import { Pool, InterestRate } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `amount` The amount to be deposited, -1 to repay max aToken balance or max debt balance without dust (whichever is lowest)
- @param `reserve` The ethereum address of the reserve 
- @param `rateMode` The debt type to repay, stable (InterestRate.Stable) or variable (InterestRate.Variable)
*/
const txs: EthereumTransactionTypeExtended[] = await pool.repayWithATokens({
  user,
  amount,
  reserve,
  reateMode,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### withdraw (V3)

Withdraws the underlying asset of an aToken asset.

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `aTokenAddress` The aToken to redeem for underlying asset
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await pool.withdraw({
  user,
  reserve,
  amount,
  aTokenAddress,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### swapBorrowRateMode (V3)

Borrowers can use this function to swap between stable and variable borrow rate
modes

<details>
  <summary>Sample Code</summary>

```ts
import { Pool, InterestRate } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `interestRateMode` The rate mode to swap to, stable (InterestRate.Stable) or variable (InterestRate.Variable) 
*/
const txs: EthereumTransactionTypeExtended[] = await pool.swapBorrowRateMode({
  user,
  reserve,
  amount,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### setUsageAsCollateral (V3)

Allows depositors to enable or disable a specific deposit as collateral

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `usageAsCollateral` Boolean, true if the user wants to use the deposit as collateral, false otherwise
*/
const txs: EthereumTransactionTypeExtended[] = await pool.setUsageAsCollateral({
  user,
  reserve,
  usageAsCollateral,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### liquidationCall (V3)

Users can invoke this function to liquidate an undercollateralized position

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `liquidator` The ethereum address that will liquidate the position 
- @param `liquidatedUser` The address of the borrower 
- @param `debtReserve` The ethereum address of the principal reserve 
- @param `collateralReserve` The address of the collateral to liquidated 
- @param `purchaseAmount` The amount of principal that the liquidator wants to repay 
- @param @optional `getAToken` Boolean to indicate if the user wants to receive the aToken instead of the asset. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.liquidationCall({
  liquidator,
  liquidatedUser,
  debtReserve,
  collateralReserve,
  purchaseAmount,
  getAToken,
});
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### swapCollateral (V3)

Utilizes flashloan to swap to a different collateral asset

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  SWAP_COLLATERAL_ADAPTER: swapCollateralAdapterAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will liquidate the position 
- @param @optional `flash` If the transaction will be executed through a flashloan(true) or will be done directly through the adapters(false). Defaults to false 
- @param `fromAsset` The ethereum address of the asset you want to swap 
- @param `fromAToken` The ethereum address of the aToken of the asset you want to swap 
- @param `toAsset` The ethereum address of the asset you want to swap to (get) 
- @param `fromAmount` The amount you want to swap 
- @param `toAmount` The amount you want to get after the swap 
- @param `maxSlippage` The max slippage that the user accepts in the swap 
- @param @optional `permitSignature` A permit signature of the tx. Only needed when previously signed (Not needed at the moment). 
- @param `swapAll` Bool indicating if the user wants to swap all the current collateral 
- @param @optional `onBehalfOf` The ethereum address for which user is swapping. It will default to the user address 
- @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer) 
- @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] = await lendingPool.swapCollateral(
  {
    user,
    flash,
    fromAsset,
    fromAToken,
    toAsset,
    fromAmount,
    toAmount,
    maxSlippage,
    permitSignature,
    swapAll,
    onBehalfOf,
    referralCode,
    useEthPath,
  },
);
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### repayWithCollateral (V3)

Allows a borrower to repay the open debt with their collateral

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  REPAY_WITH_COLLATERAL_ADAPTER: repayWithCollateralAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will liquidate the position 
- @param `fromAsset` The ethereum address of the asset you want to repay with (collateral) 
- @param `fromAToken` The ethereum address of the aToken of the asset you want to repay with (collateral) 
- @param `assetToRepay` The ethereum address of the asset you want to repay 
- @param `repayWithAmount` The amount of collateral you want to repay the debt with
- @param `repayAmount` The amount of debt you want to repay 
- @param `permitSignature` A permit signature of the tx. Optional
- @param @optional `repayAllDebt` Bool indicating if the user wants to repay all current debt. Defaults to false 
- @param `rateMode` //Enum indicating the type of the interest rate of the collateral
- @param @optional `onBehalfOf` The ethereum address for which user is swapping. It will default to the user address 
- @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer) 
- @param @optional `flash` If the transaction will be executed through a flashloan(true) or will be done directly through the adapters(false). Defaults to false 
- @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] =
  await lendingPool.repayWithCollateral({
    user,
    fromAsset,
    fromAToken,
    assetToRepay,
    repayWithAmount,
    repayAmount,
    permitSignature,
    repayAllDebt,
    rateMode,
    onBehalfOf,
    referralCode,
    flash,
    useEthPath,
  });
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### setUserEMode

Function to enable eMode on a user account IF conditions are met:

To enable, pass `categoryId` of desired eMode (1 = stablecoins), can only be
enabled if a users currently borrowed assets are ALL within this eMode category
To disable, pass `categoryId` of 0, can only be disabled if new LTV will not
leave user undercollateralized

<details>
  <summary>Sample Code</summary>

```ts
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL: poolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `categoryId` number representing the eMode to switch to, 0 = disable, 1 = stablecoins
*/
const txs: EthereumTransactionTypeExtended[] = await pool.setUserEMode({
  user,
  categoryId,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

## Lending Pool V2

Object that contains all the necessary methods to create Aave V2 lending pool
transactions

### deposit

Deposits the underlying asset into the reserve. For every token that is
deposited, a corresponding amount of aTokens is minted

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = await lendingPool.deposit({
  user,
  reserve,
  amount,
  onBehalfOf,
});
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### borrow

Borrow an `amount` of `reserve` asset.

User must have a collateralized position (i.e. aTokens in their wallet)

</details>

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool, InterestRate } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will receive the borrowed amount 
- @param `reserve` The ethereum address of the reserve asset 
- @param `amount` The amount to be borrowed, in human readable units (e.g. 2.5 ETH)
- @param `interestRateMode`//Whether the borrow will incur a stable (InterestRate.Stable) or variable (InterestRate.Variable) interest rate
- @param @optional `debtTokenAddress` The ethereum address of the debt token of the asset you want to borrow. Only needed if the reserve is ETH mock address 
- @param @optional `onBehalfOf` The ethereum address for which user is borrowing. It will default to the user address 
*/
const txs: EthereumTransactionTypeExtended[] = await lendingPool.borrow({
  user,
  reserve,
  amount,
  interestRateMode,
  debtTokenAddress,
  onBehalfOf,
  referralCode,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### repay

Repays a borrow on the specific reserve, for the specified amount (or for the
whole amount, if (-1) is specified). the target user is defined by `onBehalfOf`.
If there is no repayment on behalf of another account, `onBehalfOf` must be
equal to `user`

If the `user` is not approved, an approval transaction will also be returned

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool, InterestRate } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that repays 
- @param `reserve` The ethereum address of the reserve on which the user borrowed
- @param `amount` The amount to repay, or (-1) if the user wants to repay everything
- @param `interestRateMode` // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid
- @param @optional `onBehalfOf` The ethereum address for which user is repaying. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.repay({
  user,
  reserve,
  amount,
  interestRateMode,
  onBehalfOf,
});
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### withdraw

Withdraws the underlying asset of an aToken asset.

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will receive the aTokens 
- @param `reserve` The ethereum address of the reserve asset 
- @param `amount` The amount of aToken being redeemed 
- @param @optional `aTokenAddress` The ethereum address of the aToken. Only needed if the reserve is ETH mock address 
- @param @optional `onBehalfOf` The amount of aToken being redeemed. It will default to the user address
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.withdraw({
  user,
  reserve,
  amount,
  aTokenAddress,
  onBehalfOf,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### swapBorrowRateMode

Borrowers can use this function to swap between stable and variable borrow rate
modes.

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool, InterestRate } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
});

/*
- @param `user` The ethereum address that wants to swap rate modes 
- @param `reserve` The address of the reserve on which the user borrowed 
- @param `interestRateMode` //Whether the borrow will incur a stable (InterestRate.Stable) or variable (InterestRate.Variable) interest rate
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.swapBorrowRateMode({
  user,
  reserve,
  interestRateMode,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### setUsageAsCollateral

Allows depositors to enable or disable a specific deposit as collateral

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool, InterestRate } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
});

/*
- @param `user` The ethereum address that enables or disables the deposit as collateral
- @param `reserve` The ethereum address of the reserve 
- @param `useAsCollateral` Boolean, true if the user wants to use the deposit as collateral, false otherwise
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.setUsageAsCollateral(
  {
    user,
    reserve,
    usageAsCollateral,
  },
);
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### liquidationCall

Users can invoke this function to liquidate an undercollateralized position.

</details>

<details>
  <summary>Sample Code</summary>

```ts
import { LendingPool } from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `liquidator` The ethereum address that will liquidate the position 
- @param `liquidatedUser` The address of the borrower 
- @param `debtReserve` The ethereum address of the principal reserve 
- @param `collateralReserve` The address of the collateral to liquidated 
- @param `purchaseAmount` The amount of principal that the liquidator wants to repay
- @param @optional `getAToken` Boolean to indicate if the user wants to receive the aToken instead of the asset. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] = lendingPool.liquidationCall({
  liquidator,
  liquidatedUser,
  debtReserve,
  collateralReserve,
  purchaseAmount,
  getAToken,
});
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### swapCollateral

Allows users to swap a collateral to another asset

<details>
  <summary>Sample Code</summary>

```ts
import {
  LendingPool,
  InterestRate,
  PermitSignature,
} from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  SWAP_COLLATERAL_ADAPTER: swapCollateralAdapterAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will liquidate the position 
- @param @optional `flash` If the transaction will be executed through a flashloan(true) or will be done directly through the adapters(false). Defaults to false 
- @param `fromAsset` The ethereum address of the asset you want to swap 
- @param `fromAToken` The ethereum address of the aToken of the asset you want to swap
- @param `toAsset` The ethereum address of the asset you want to swap to (get) 
- @param `fromAmount` The amount you want to swap 
- @param `toAmount` The amount you want to get after the swap 
- @param `maxSlippage` The max slippage that the user accepts in the swap 
- @param @optional `permitSignature` A permit signature of the tx. Only needed when previously signed (Not needed at the moment).
- @param `swapAll` Bool indicating if the user wants to swap all the current collateral
- @param @optional `onBehalfOf` The ethereum address for which user is swapping. It will default to the user address
- @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
- @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] = await lendingPool.swapCollateral(
  {
    user,
    flash,
    fromAsset,
    fromAToken,
    toAsset,
    fromAmount,
    toAmount,
    maxSlippage,
    permitSignature,
    swapAll,
    onBehalfOf,
    referralCode,
    useEthPath,
  },
);
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

### repayWithCollateral

Allows a borrower to repay the open debt with their collateral

<details>
  <summary>Sample Code</summary>

```ts
import {
  LendingPool,
  InterestRate,
  PermitSignature,
} from '@aave/contract-helpers';

const lendingPool = new LendingPool(provider, {
  LENDING_POOL: lendingPoolAddress,
  REPAY_WITH_COLLATERAL_ADAPTER: repayWithCollateralAddress,
  WETH_GATEWAY: wethGatewayAddress,
});

/*
- @param `user` The ethereum address that will liquidate the position 
- @param `fromAsset` The ethereum address of the asset you want to repay with (collateral)
- @param `fromAToken` The ethereum address of the aToken of the asset you want to repay with (collateral)
- @param `assetToRepay` The ethereum address of the asset you want to repay 
- @param `repayWithAmount` The amount of collateral you want to repay the debt with
- @param `repayAmount` The amount of debt you want to repay 
- @param `permitSignature` A permit signature of the tx. Optional
- @param @optional `repayAllDebt` Bool indicating if the user wants to repay all current debt. Defaults to false
- @param `rateMode` //Enum indicating the type of the interest rate of the collateral
- @param @optional `onBehalfOf` The ethereum address for which user is swapping. It will default to the user address
- @param @optional `referralCode` Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
- @param @optional `flash` If the transaction will be executed through a flashloan(true) or will be done directly through the adapters(false). Defaults to false
- @param @optional `useEthPath` Boolean to indicate if the swap will use an ETH path. Defaults to false
*/
const txs: EthereumTransactionTypeExtended[] =
  await lendingPool.repayWithCollateral({
    user,
    fromAsset,
    fromAToken,
    assetToRepay,
    repayWithAmount,
    repayAmount,
    permitSignature,
    repayAllDebt,
    rateMode,
    onBehalfOf,
    referralCode,
    flash,
    useEthPath,
  });
```

Submit transaction(s) as shown [here](#submitting-transactions)

</details>

<br />

## Governance V2

Example of how to use functions of the Aave governance service

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const httpProvider = new Web3.providers.HttpProvider(
  process.env.ETHEREUM_URL || 'https://kovan.infura.io/v3/<project_id>',
);

const governanceService = new AaveGovernanceService(httpProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});
```

### create

Creates a Proposal (needs to be validated by the Proposal Validator)

<details>
  <summary>Sample Code</summary>

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const governanceService = new AaveGovernanceService(rpcProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});

/*
- @param `user` The ethereum address that will create the proposal
- @param `targets` list of contracts called by proposal's associated transactions
- @param `values` list of value in wei for each proposal's associated transaction
- @param `signatures` list of function signatures (can be empty) to be used when created the callData
- @param `calldatas` list of calldatas: if associated signature empty, calldata ready, else calldata is arguments
- @param `withDelegatecalls` boolean, true = transaction delegatecalls the target, else calls the target
- @param `ipfsHash` IPFS hash of the proposal
- @param `executor` The ExecutorWithTimelock contract that will execute the proposal: ExecutorType.Short or ExecutorType.Long
*/
const tx = governanceService.create({
  user,
  targets,
  values,
  signatures,
  calldatas,
  withDelegatecalls,
  ipfsHash,
  executor,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>
<br />

### cancel

Cancels a Proposal. Callable by the guardian with relaxed conditions, or by
anybody if the conditions of cancellation on the executor are fulfilled

<details>
  <summary>Sample Code</summary>

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const governanceService = new AaveGovernanceService(rpcProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});

/*
- @param `user` The ethereum address that will create the proposal
- @param `proposalId` Id of the proposal we want to queue
*/
const tx = governanceService.cancel({ user, proposalId });
```

Submit transaction as shown [here](#submitting-transactions)

</details>
<br />

### queue

Queue the proposal (If Proposal Succeeded)

<details>
  <summary>Sample Code</summary>

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const governanceService = new AaveGovernanceService(rpcProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});

/*
- @param `user` The ethereum address that will create the proposal
- @param `proposalId` Id of the proposal we want to queue
*/
const tx = governanceService.queue({ user, proposalId });
```

Submit transaction as shown [here](#submitting-transactions)

</details>

</details>

<br />

### execute

Execute the proposal (If Proposal Queued)

<details>
  <summary>Sample Code</summary>

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const governanceService = new AaveGovernanceService(rpcProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});

/*
- @param `user` The ethereum address that will create the proposal
- @param `proposalId` Id of the proposal we want to execute
*/
const tx = governanceService.execute({ user, proposalId });
```

Submit transaction as shown [here](#submitting-transactions)

</details>
<br />

### submitVote

Function allowing msg.sender to vote for/against a proposal

<details>
  <summary>Sample Code</summary>

```ts
import { AaveGovernanceService } from '@aave/contract-helpers';

const governanceService = new AaveGovernanceService(rpcProvider, {
  GOVERNANCE_ADDRESS: aaveGovernanceV2Address,
  GOVERNANCE_HELPER_ADDRESS: aaveGovernanceV2HelperAddress,
  ipfsGateway: IPFS_ENDPOINT,
});

/*
- @param `user` The ethereum address that will create the proposal 
- @param `proposalId` Id of the proposal we want to vote 
- @param `support` Bool indicating if you are voting in favor (true) or against (false)
*/
const tx = governanceService.submitVote({ user, proposalId, support });
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### delegate

Method for the user to delegate voting `and` proposition power to the chosen
address

<details>
  <summary>Sample Code</summary>

```ts
import { GovernancePowerDelegationTokenService } from '@aave/contract-helpers';

const powerDelegation = new GovernancePowerDelegationTokenService(rpcProvider);

/*
- @param `user` The ethereum address that will create the proposal 
- @param `delegatee` The ethereum address to which the user wants to delegate proposition power and voting power
- @param `governanceToken` The ethereum address of the governance token
*/
const tx = powerDelegation.delegate({ user, delegatee, governanceToken });
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

### delegateByType

Method for the user to delegate voting `or` proposition power to the chosen
address

<details>
  <summary>Sample Code</summary>

```ts
import { GovernancePowerDelegationTokenService } from '@aave/contract-helpers';

const powerDelegation = new GovernancePowerDelegationTokenService(rpcProvider);

/*
- @param `user` The ethereum address that will create the proposal 
- @param `delegatee` The ethereum address to which the user wants to delegate proposition power and voting power
- @param `delegationType` The type of the delegation the user wants to do: voting power ('0') or proposition power ('1')
- @param `governanceToken` The ethereum address of the governance token
*/
const tx = powerDelegation.delegateByType({
  user,
  delegatee,
  delegationType,
  governanceToken,
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>

<br />

## Faucets

To use the testnet faucets which are compatible with Aave:

### mint

Mint tokens for the usage on the Aave protocol on a test network. The amount of
minted tokens is fixed and depends on the token

<details>
  <summary>Sample Code</summary>

```ts
import { FaucetService } from '@aave/contract-helpers';

const faucetService = new FaucetService(provider, faucetAddress);

/*
- @param `userAddress` The ethereum address of the wallet the minted tokens will go
- @param `reserve` The ethereum address of the token you want to mint 
- @param `tokenSymbol` The symbol of the token you want to mint
*/
const tx = faucet.mint({ userAddress, reserve, tokenSymbol });
```

Submit transaction as shown [here](#submitting-transactions)

</details>


<br />

## Credit Delegation

Credit delegation is performed on the debtToken contract through the `approveDelegation` function, which approves a spender to borrow a specified amount of that token.

Accessing delegated credit is done by passing the delegator address as the `onBehalfOf` parameter when calling `borrow` on the `Pool` (V3) or `LendingPool` (V2).

### approveDelegation


<details>
  <summary>Sample Code</summary>

```ts
import { BaseDebtToken, ERC20Service } from "@aave/contract-helpers";
import { ethers } from "ethers";

// Sample public RPC address for querying polygon mainnet
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com"
);

const delegationServicePolygonV2USDC = new BaseDebtToken(
  provider,
  new ERC20Service(provider) // This parameter will be removed in future utils version
);

const approveDelegation = delegationServicePolygonV2USDC.approveDelegation({
  user: "...",  /// delegator
  delegatee: "...",
  debtTokenAddress: "...", // can be any V2 or V3 debt token
  amount: 1, // in decimals of underlying token
});
```

Submit transaction as shown [here](#submitting-transactions)

</details>