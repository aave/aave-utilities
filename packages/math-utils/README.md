# @aave/math-utils

**disclaimer**: this package is highly unstable. Once we reach a certain level
of stability, we'll bump the version to 1.x and add appropriate documentation.

AAVE aggregates on-chain protocol data into a variety of different subgraphs on
TheGraph which can be queried directly using the playground and integrated into
applications directly via TheGraph API.

In addition to the subgraphs, aave offers a set of
[contract helpers](https://github.com/aave/aave-utilities/tree/master/packages/contract-helpers)
to query aggregated on-chain data.

The `@aave/math-utils` data formatting methods act as a layer on top of the
chain data. The use-cases range from "human readable formatting" to
"approximating accrual over time".

## Installation

Install the package in your project directory with:

```sh
// with npm
npm install @aave/math-utils

// with yarn
yarn add @aave/math-utils
```
