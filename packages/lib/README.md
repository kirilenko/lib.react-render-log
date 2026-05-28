# react-render-log

[![CI](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml/badge.svg)](https://github.com/kirilenko/lib.react-render-log/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-render-log)](https://www.npmjs.com/package/react-render-log)

Log React component re-renders to the browser console — color-coded by render type (first render, strict-mode repeat, extra re-render).

## Installation

```bash
npm install react-render-log
# pnpm
pnpm add react-render-log
```

## Usage

### 1. Wrap your app with `RenderLogProvider`

```tsx
import { RenderLogProvider } from 'react-render-log'

function App() {
  return (
    <RenderLogProvider debugEnabled={process.env.NODE_ENV === 'development'} isStrictMode={false}>
      {/* your app */}
    </RenderLogProvider>
  )
}
```

### 2a. HOC — `withRenderLog`

Wraps a component and automatically logs every render. The component receives `getRenderLog` as a prop for optional extra logging.

```tsx
import { withRenderLog } from 'react-render-log'
import type { PropsWithRenderLog } from 'react-render-log'

type Props = PropsWithRenderLog<{ name: string }>

function UserCard({ name }: Props) {
  return <div>{name}</div>
}

export default withRenderLog(UserCard)
```

Use `renderLogId` to distinguish instances of the same component:

```tsx
items.map((item) => <UserCard key={item.id} name={item.name} renderLogId={item.id} />)
// logs: • UserCard.42, • UserCard.43, …
```

### 2b. Hook — `useRenderLog`

```tsx
import { useRenderLog } from 'react-render-log'

function UserCard({ name }: { name: string }) {
  const getRenderLog = useRenderLog()
  getRenderLog('UserCard')()
  return <div>{name}</div>
}
```

## `RenderLogProvider` props

| Prop           | Type              | Default                                                | Description                                                                |
| -------------- | ----------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `debugEnabled` | `boolean`         | —                                                      | Enable/disable logging                                                     |
| `isStrictMode` | `boolean`         | —                                                      | Marks the 2nd render as a strict-mode repeat instead of an extra re-render |
| `colors`       | `RenderLogColors` | `{ firstRender: 'lightgreen', extraRender: 'orange' }` | Console colors per render type                                             |
| `timeToLive`   | `number` (ms)     | `500`                                                  | Window within which repeated renders are counted as re-renders             |

## Console output

| Render             | Color (default) | Label                                   |
| ------------------ | --------------- | --------------------------------------- |
| First              | `lightgreen`    | `• MyComponent`                         |
| Strict-mode repeat | `lightgreen`    | `• MyComponent - repeat by strict-mode` |
| Extra re-render    | `orange`        | `• MyComponent - extra repeats (N)!`    |

## Peer dependencies

| Package     | Version |
| ----------- | ------- |
| `react`     | ≥ 18    |
| `react-dom` | ≥ 18    |

## License

MIT
