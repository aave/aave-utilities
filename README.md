# Aave utilities

<p align="center">
  <a href="https://aave.com/" rel="noopener" target="_blank"><img width="150" src="https://aave.com/static/media/ghostGradient.77808e40.svg" alt="Aave logo"></a></p>
</p>

<h1 align="center">Aave utilities</h1>

<div align="center">

## Installation

Aave utilities are available as npm
packages[¹](https://www.npmjs.com/package/@aave/contract-helpers)[²](https://www.npmjs.com/package/@aave/math-utils).

```sh
// with npm
npm install @aave/contract-helpers @aave/math-utils
// with yarn
yarn add @aave/contract-helpers @aave/math-utils
```

## Usage

Here is a quick example to get you started:

```ts
import { PermissionManager } from '@aave/contract-helpers';

const instance = new PermissionManager({
  provider: rpcProvider,
  permissionManagerAddress: permissionManagerAddress,
});
const permissions = await instance.getHumanizedUserPermissions(walletAddress);
```

## Examples

Are you looking for an example project to get started? Check out repositories
relying on this library:

- [The open source aave ui](https://github.com/aave/aave-ui)
- [Aave info](https://github.com/sakulstra/info.aave)
