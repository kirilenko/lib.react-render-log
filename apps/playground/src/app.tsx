import { useState } from 'react'
import { RenderLogProvider, withRenderLog } from 'react-render-log'
import type { PropsWithRenderLog } from 'react-render-log'

type ItemProps = PropsWithRenderLog<{ text: string; index: number }>

function ItemBase({ text, index }: ItemProps) {
  return (
    <li
      style={{
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid #e4e4e7',
        fontVariantNumeric: 'tabular-nums',
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
      <main style={{ padding: '2rem 3rem', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          react-render-log
        </h1>
        <p style={{ color: '#71717a', marginBottom: '2rem', fontSize: '0.875rem' }}>
          Open the browser console to see render logs.
        </p>

        <section
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={debugEnabled}
              onChange={(e) => setDebugEnabled(e.target.checked)}
            />
            <code style={{ fontSize: '0.875rem' }}>debugEnabled</code>
          </label>
          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
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
            listStyle: 'none',
            padding: 0,
            border: '1px solid #e4e4e7',
            borderRadius: 6,
            marginBottom: '1rem',
            overflow: 'hidden',
          }}
        >
          {items.map((text, index) => (
            <Item key={text} text={text} index={index} renderLogId={index} />
          ))}
        </ul>

        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            border: '1px solid #e4e4e7',
            background: '#18181b',
            color: '#fafafa',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Force re-render ({count})
        </button>
      </main>
    </RenderLogProvider>
  )
}
