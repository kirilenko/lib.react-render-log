# lib.react-render-log

[![CI](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml/badge.svg)](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-render-log)](https://www.npmjs.com/package/react-render-log)
[![license](https://img.shields.io/npm/l/react-render-log)](./packages/lib/README.md#license)

Monorepo for the [`react-render-log`](https://www.npmjs.com/package/react-render-log) npm package — a React hook and HOC for logging component re-renders to the browser console, color-coded by render type.

## Requirements

| Tool | Version                            |
| ---- | ---------------------------------- |
| Node | ≥ 18 (`.nvmrc` pins `24.12.0`)     |
| pnpm | ≥ 9 (`9.12.0` pinned via corepack) |

## Structure

```
packages/lib    — the published library (react-render-log)
apps/playground — Vite dev app for manual testing
```

## Setup

```bash
pnpm setup   # installs correct Node + pnpm via nvm, then runs pnpm install
```

Or manually:

```bash
nvm use
pnpm install
```

## Commands

| Command        | Description                           |
| -------------- | ------------------------------------- |
| `pnpm dev`     | Start playground in watch mode        |
| `pnpm build`   | Build the library (CJS + ESM + types) |
| `pnpm test`    | Run tests                             |
| `pnpm check`   | Lint + typecheck + prettier           |
| `pnpm release` | Publish to npm via semantic-release   |

## Contributing

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org) spec — enforced by commitlint on every commit.

```
feat: add something new
fix: correct a bug
chore: housekeeping
docs: documentation only
refactor: no behaviour change
test: add or update tests
```

`semantic-release` derives the next version and changelog from these prefixes automatically:

- `fix` → patch
- `feat` → minor
- `feat` + `BREAKING CHANGE` footer → major
