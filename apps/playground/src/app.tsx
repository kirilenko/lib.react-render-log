import { useState } from 'react'
import type { PropsWithRenderLog } from 'react-render-log'
import { RenderLogProvider, withRenderLog } from 'react-render-log'

type ItemProps = PropsWithRenderLog<{ text: string; index: number }>

function ItemBase({ index, text }: ItemProps) {
  return (
    <li
      style={{
        borderBottom: '1px solid #e4e4e7',
        fontVariantNumeric: 'tabular-nums',
        padding: '0.5rem 0.75rem',
      }}
    >
      <span style={{ color: '#a1a1aa', marginRight: '0.5rem' }}>#{index + 1}</span>
      {text}
    </li>
  )
}

const Item = withRenderLog(ItemBase, 'Item')

const items = ['Apple', 'Banana', 'Cherry']

export default function App() {
  const [count, setCount] = useState(0)
  const [debugEnabled, setDebugEnabled] = useState(true)
  const [isStrictMode, setIsStrictMode] = useState(false)

  return (
    <RenderLogProvider debugEnabled={debugEnabled} isStrictMode={isStrictMode}>
      <main style={{ margin: '0 auto', maxWidth: 520, padding: '2rem 3rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          react-render-log
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Open the browser console to see render logs.
        </p>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <label
            style={{ alignItems: 'center', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="checkbox"
              checked={debugEnabled}
              onChange={(e) => setDebugEnabled(e.target.checked)}
            />
            <code style={{ fontSize: '0.875rem' }}>debugEnabled</code>
          </label>
          <label
            style={{ alignItems: 'center', cursor: 'pointer', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="checkbox"
              checked={isStrictMode}
              onChange={(e) => setIsStrictMode(e.target.checked)}
            />
            <code style={{ fontSize: '0.875rem' }}>isStrictMode</code>
          </label>
        </section>

        <ul
          style={{
            border: '1px solid #e4e4e7',
            borderRadius: 6,
            listStyle: 'none',
            marginBottom: '1rem',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          {items.map((text, index) => (
            <Item key={text} text={text} index={index} renderLogId={index} />
          ))}
        </ul>

        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            background: '#18181b',
            border: '1px solid #e4e4e7',
            borderRadius: 6,
            color: '#fafafa',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
          }}
        >
          Force re-render ({count})
        </button>
      </main>
    </RenderLogProvider>
  )
}
