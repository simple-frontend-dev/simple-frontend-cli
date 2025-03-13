# simplefrontend, the [Simple Frontend](<[https://](https://www.simplefrontend.dev/)>) CLI

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
- lint (Code liting with [ESLint](https://eslint.org/))
- typescript ([TypeScript](https://www.typescriptlang.org/) setup )
- pre-push (Pre-push hook with [lefthook](https://github.com/evilmartians/lefthook))
- github-actions ([Github actions](https://docs.github.com/en/actions) setup)

Supported package managers:

- pnpm
- npm
- yarn
- bun
