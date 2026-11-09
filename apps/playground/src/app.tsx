import type { ReactNode } from 'react'
import { useState } from 'react'
import { RenderLogProvider, useRenderLog, withRenderLog } from 'react-render-log'

type ItemProps = { text: string; index: number }

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

const Item = withRenderLog(ItemBase, { name: 'Item' })

function Counter({ count }: { count: number }) {
  useRenderLog('Counter', { details: { count, step: Math.floor(count / 3) } })
  return null
}

// Gets an inline callback and a new `children` element on every render:
// the log shows them as "changed by reference"
function ResetBase({ children, onReset }: { children: ReactNode; onReset: () => void }) {
  return (
    <button onClick={onReset} style={{ ...buttonStyle, background: '#fafafa', color: '#18181b' }}>
      {children}
    </button>
  )
}

const Reset = withRenderLog(ResetBase, { name: 'Reset' })

const buttonStyle = {
  background: '#18181b',
  border: '1px solid #e4e4e7',
  borderRadius: 6,
  color: '#fafafa',
  cursor: 'pointer',
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
}

const items = ['Apple', 'Banana', 'Cherry']

export default function App() {
  const [count, setCount] = useState(0)
  const [debugEnabled, setDebugEnabled] = useState(true)

  return (
    <RenderLogProvider debugEnabled={debugEnabled}>
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

        <Counter count={count} />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCount((c) => c + 1)} style={buttonStyle}>
            Force re-render ({count})
          </button>
          <Reset onReset={() => setCount(0)}>
            <span>Reset</span>
          </Reset>
        </div>
      </main>
    </RenderLogProvider>
  )
}
