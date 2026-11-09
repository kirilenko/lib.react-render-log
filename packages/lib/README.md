# react-render-log

[![CI](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml/badge.svg)](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-render-log)](https://www.npmjs.com/package/react-render-log)

Log React component renders to the browser console: mounts, numbered re-renders, and what changed between them.

## Installation

```bash
npm install react-render-log
# pnpm
pnpm add react-render-log
```

## Usage

### 1. Wrap yo## Usage

### 1. Wrap your app with `RenderLogProvider`

```tsx
import { RenderLogProvider } from 'react-render-log'

function App() {
  return (
    <RenderLogProvider debugEnabled={process.env.NODE_ENV === 'development'}>
      {/* your app */}
    </RenderLogProvider>
  )
}
```

Without the provider, or with `debugEnabled={false}`, nothing is logged.

### 2a. Hook — `useRenderLog`

```tsx
import { useRenderLog } from 'react-render-log'

function UserCard({ user, filter }: Props) {
  useRenderLog('UserCard', { details: { user, filter } })
  // ...
}
```

```
• UserCard - mount                          {user: {…}, filter: 'all'}     green
• UserCard - re-render #1 ⟶ changed: filter {user: {…}, filter: 'active'}  green
• UserCard - re-render #2 ⟶ nothing changed {user: {…}, filter: 'active'}  orange
```

| Option     | Type                      | Description                                                                                |
| ---------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| `details`  | `Record<string, unknown>` | Logged as is (expandable in DevTools); keys changed since the last logged render are named |
| `expected` | `number`                  | Max renders per mount; each render beyond it logs a red `console.error`                    |

### 2b. HOC — `withRenderLog`

```tsx
import { withRenderLog } from 'react-render-log'

function UserCard({ name }: { name: string }) {
  return <div>{name}</div>
}

export default withRenderLog(UserCard, { expected: 2 })
```

Options: `name` (defaults to the component's `displayName` or `name`) and `expected`.

The HOC logs the component's props as `details`, so a re-render with the same props, one that `memo` would have skipped, shows up orange with `⟶ nothing changed`.

Use `renderLogId` to tell instances apart in the log. It is not passed to the wrapped component:

```tsx
items.map((item) => <UserCard key={item.id} name={item.name} renderLogId={item.id} />)
// • UserCard.42 - mount, • UserCard.43 - mount, …
```

## How renders are counted

Each component instance has its own counter, and only committed renders count. Renders React throws away, such as the strict-mode double render or an interrupted concurrent render, are not logged.

A remount starts the count over and logs `mount` again. In a virtualized list, frequent `mount` logs for the same rows show that they keep being remounted.

Logs are written after commit, so a child's log comes before its parent's.

## Colors

Green means all is well, orange marks a re-render worth fixing, red means `expected` is exceeded.

A re-render is orange when it has no visible reason:

- with `details`, none of its keys changed since the last logged render;
- without `details`, it came sooner than `burstWindow` (500 ms by default) after the previous one: a quick burst of re-renders is usually unnecessary.

## `RenderLogProvider` props

| Prop           | Type              | Default                                       | Description                                                                          |
| -------------- | ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `debugEnabled` | `boolean`         | —                                             | Enable/disable logging                                                               |
| `colors`       | `RenderLogColors` | `{ mount: 'lightgreen', rerender: 'orange' }` | `mount`: mounts and re-renders with a reason; `rerender`: re-renders without one     |
| `burstWindow`  | `number` (ms)     | `500`                                         | Without `details`, a re-render sooner than this after the previous one is suspicious |

## Migrating from 1.x

- `useRenderLog()(name)(...args)` → `useRenderLog(name, { details, expected })`
- `withRenderLog(Component, name)` → `withRenderLog(Component, { name, expected })`; the wrapped component no longer gets `getRenderLog`, call `useRenderLog` in it instead
- `isStrictMode` is gone: strict-mode renders are skipped automatically
- `timeToLive` → `burstWindow`: it no longer resets the count, it only decides the color of re-renders without `details`
- `colors` keys: `firstRender` → `mount`, `extraRender` → `rerender`
- Types `PropsWithRenderLog`, `OwnRenderLogProviderProps` and `RenderLogContextValue` are removed

## Peer dependencies

| Package     | Version |
| ----------- | ------- |
| `react`     | ≥ 18    |
| `react-dom` | ≥ 18    |

## License

MIT
