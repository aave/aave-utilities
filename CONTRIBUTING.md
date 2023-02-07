# Aave utilities

## Scripts

The following [npm scripts](https://docs.npmjs.com/misc/scripts) are made
available to you in the project root. You can run each of them with
`npm run <script-name>`.

If you want to limit the scope of a script to a particular package, add the
`--scope` option to the command (e.g.,
`npm run clean -- --scope=@aave/math-utils`). See [run options][].

You can also run [Lerna commands](https://lerna.js.org/#commands) in this
project. It is recommended that you use
[`npx`](https://www.npmjs.com/package/npx) to run these commands (i.e.,
`npx lerna <command>`).

### clean

_Supports [run options][]._

Clean coverage results in `./coverage` and runs `npm run clean` for each
package.

### lint

_Supports [run options][]._

Runs ESLint for each package.

### check-types

_Supports [run options][]._

Runs the TypeScript compiler for each package without emitting any files. This
is used in a pre-push hook for a faster alternative than a full build, so you
probably won't want to run it directly.

### build

_Supports [run options][]._

Runs the TypeScript compiler for each package.

### test

Runs [Jest][] in [watch mode](https://jestjs.io/docs/en/cli.html#watch), which
attempts to run
[only on changed files](https://jestjs.io/docs/en/cli.html#onlychanged).

This command doesn't support `--scope`, but you can narrow the test run by
adding filename (path) filters in as many `...args` that follow (e.g.,
`npm test core/src`).

### cover

Runs [Jest][] in [coverage mode](https://jestjs.io/docs/en/cli.html#coverage),
dumping coverage results in `./coverage` and showing a text summary in the
console output.

Feel free to add more
[coverage reporters](https://jestjs.io/docs/en/configuration.html#coveragereporters-array-string)
to the list. The [Jest][] configuration can be found in the root `package.json`.

### commit

Runs [Commitizen](http://commitizen.github.io/cz-cli/) commit wizard, ensuring
that your commit messages conform to
[Conventional Commits](https://www.conventionalcommits.org/).

Use the [`git commit`](https://git-scm.com/docs/git-commit) command directly
with the
[`-n`, `--no-verify` option](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt--n)
to bypasses the pre-commit and commit-msg hooks.

[jest]: https://jestjs.io/
[run options]: https://github.com/lerna/lerna/tree/master/commands/run#options

### Setup a new package

When we setup a new package you just need to create a new folder in `packages`
and do `npm init` and `tsc --init`. In the `tsconfig` paste:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist/esm",
    "rootDir": "src"
  }
}
```

In the package.json copy these scripts and replace `YOUR_PACKAGE_NAME` with your
package name

```json
"scripts": {
    "clean": "cd ../.. && npx rimraf packages/YOUR_PACKAGE_NAME/dist packages/math-utils/*.log*",
    "lint": "cd ../.. && eslint packages/YOUR_PACKAGE_NAME/src/**/*.ts",
    "check-types": "yarn build -- --noEmit",
    "prebuild": "yarn clean",
    "build": "cd ../.. && tsc -p packages/YOUR_PACKAGE_NAME/tsconfig.json && tsc -p packages/YOUR_PACKAGE_NAME/tsconfig.json --module commonjs --outDir ./packages/YOUR_PACKAGE_NAME/dist/cjs",
    "test": "cd ../.. && yarn test packages/YOUR_PACKAGE_NAME",
    "cover": "cd ../.. && yarn cover packages/YOUR_PACKAGE_NAME",
    "commit": "cd ../.. && yarn commit",
    "prepublishOnly": "yarn build"
  },
```

also in the package.json paste these in:

```json
"main": "./dist/cjs/index.js",
"module": "./dist/esm/index.js",
"types": "./dist/esm/index.d.ts",
```

That's it. Now start writing your logic. You must write your typescript code in
the `src` folder in your package.
