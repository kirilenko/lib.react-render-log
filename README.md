# lib.react-render-log

Monorepo for the [`react-render-log`](https://www.npmjs.com/package/react-render-log) npm package.

## Structure

```
packages/lib   — the published library (react-render-log)
apps/playground — Vite dev app for manual testing
```

## Setup

```bash
pnpm setup   # installs correct Node + pnpm via nvm, then pnpm install
```

## Commands

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start playground in watch mode      |
| `pnpm build`   | Build the library                   |
| `pnpm test`    | Run tests                           |
| `pnpm check`   | Lint + typecheck + prettier         |
| `pnpm release` | Publish to npm via semantic-release |
