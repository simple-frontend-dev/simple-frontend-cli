# simplefrontend, the [Simple Frontend](<[https://](https://www.simplefrontend.dev/)>) CLI

A simple and straightforward CLI to help you setup and automate best practices and patterns for your frontend projects (formatting, linting, type checking) with end-to-end recipies (pre-push hook, CI/CD integration).

As the CLI will auto-detect your package manager, the only requirement for it to run is to be within an existing project root folder already installed (where you should have a `package.json` and an existing lock file).

## Setup a new frontend project with patterns:

```bash
npx simplefrontend setup
```

## Setup a new frontend project with a given pattern:

The CLI will then guide you setting up the pattern.

```bash
npx simplefrontend setup [pattern]
```

Available patterns:

- format (Code formatting with [Prettier](https://prettier.io/))
- lint (Code linting with [ESLint](https://eslint.org/) or [Oxlint](https://oxc.rs/docs/guide/usage/linter))
- typescript ([TypeScript](https://www.typescriptlang.org/) setup )
- pre-push (Pre-push hook with [lefthook](https://github.com/evilmartians/lefthook))
- github-actions ([Github actions](https://docs.github.com/en/actions) setup)

Supported package managers:

- pnpm
- npm
- yarn
- bun

## Develop

Install [pnpm](https://pnpm.io/installation)

```bash
pnpm install
```

```bash
pnpm run dev setup
```

## Contribute

I will happily accept contributions for bug fixes and improvements
