import type { ReactNode } from 'react'
import { StrictMode } from 'react'
import { render } from '@testing-library/react'
import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RenderLogProvider } from './render-log.provider'
import type { RenderLogOptions } from './render-log.types'
import { useRenderLog } from './use.render-log'
import { withRenderLog } from './with.render-log'

let logSpy: MockInstance<typeof console.log>
let errorSpy: MockInstance<typeof console.error>

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => vi.restoreAllMocks())

const logMessages = (): string[] => logSpy.mock.calls.map(([message]) => String(message))

function Logged({ name, options }: { name: string; options?: RenderLogOptions }) {
  useRenderLog(name, options)
  return null
}

function Debug({ children }: { children: ReactNode }) {
  return <RenderLogProvider debugEnabled>{children}</RenderLogProvider>
}

describe('useRenderLog', () => {
  it('does not log without a provider', () => {
    render(<Logged name="NoProvider" />)
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('does not log when debugEnabled is false', () => {
    render(
      <RenderLogProvider debugEnabled={false}>
        <Logged name="Disabled" />
      </RenderLogProvider>
    )
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('logs mount and numbered re-renders', () => {
    const { rerender } = render(
      <Debug>
        <Logged name="Counter" />
      </Debug>
    )
    rerender(
      <Debug>
        <Logged name="Counter" />
      </Debug>
    )

    expect(logMessages()).toEqual(['%c • Counter - mount', '%c • Counter - re-render #1'])
    expect(logSpy).toHaveBeenNthCalledWith(1, expect.any(String), 'color:lightgreen')
    expect(logSpy).toHaveBeenNthCalledWith(2, expect.any(String), 'color:orange')
  })

  it('does not count strict-mode double renders and effects', () => {
    const element = (
      <StrictMode>
        <Debug>
          <Logged name="Strict" />
        </Debug>
      </StrictMode>
    )
    const { rerender } = render(element)
    rerender(
      <StrictMode>
        <Debug>
          <Logged name="Strict" />
        </Debug>
      </StrictMode>
    )

    expect(logMessages()).toEqual(['%c • Strict - mount', '%c • Strict - re-render #1'])
  })

  it('counts each instance separately', () => {
    render(
      <Debug>
        <Logged name="Same" />
        <Logged name="Same" />
      </Debug>
    )

    expect(logMessages()).toEqual(['%c • Same - mount', '%c • Same - mount'])
  })

  it('starts counting again after a remount', () => {
    const { rerender } = render(
      <Debug>
        <Logged key="a" name="Row" />
      </Debug>
    )
    rerender(
      <Debug>
        <Logged key="b" name="Row" />
      </Debug>
    )

    expect(logMessages()).toEqual(['%c • Row - mount', '%c • Row - mount'])
  })

  it('logs console.error once commits exceed expected', () => {
    const options = { expected: 1 }
    const { rerender } = render(
      <Debug>
        <Logged name="Limited" options={options} />
      </Debug>
    )
    rerender(
      <Debug>
        <Logged name="Limited" options={options} />
      </Debug>
    )

    expect(logMessages()).toEqual(['%c • Limited - mount'])
    expect(errorSpy).toHaveBeenCalledWith('%c • Limited - unexpected render (2/1)!', 'color:red')
  })

  it('logs details as is and lists the keys that changed', () => {
    const { rerender } = render(
      <Debug>
        <Logged name="Details" options={{ details: { filter: 'a', page: 1 } }} />
      </Debug>
    )
    rerender(
      <Debug>
        <Logged name="Details" options={{ details: { filter: 'b', page: 1 } }} />
      </Debug>
    )

    expect(logSpy).toHaveBeenNthCalledWith(1, '%c • Details - mount', expect.any(String), {
      filter: 'a',
      page: 1,
    })
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      '%c • Details - re-render #1 → changed: filter',
      expect.any(String),
      { filter: 'b', page: 1 }
    )
  })

  it('compares details with the last logged render', () => {
    const renderTree = (debugEnabled: boolean, page: number) => (
      <RenderLogProvider debugEnabled={debugEnabled}>
        <Logged name="Paused" options={{ details: { page } }} />
      </RenderLogProvider>
    )

    const { rerender } = render(renderTree(true, 1))
    rerender(renderTree(false, 2))
    rerender(renderTree(true, 2))

    expect(logMessages()).toEqual([
      '%c • Paused - mount',
      '%c • Paused - re-render #2 → changed: page',
    ])
  })
})

describe('re-render color', () => {
  const renderDetails = (page: number) => (
    <Debug>
      <Logged name="Colors" options={{ details: { page } }} />
    </Debug>
  )

  it('marks a re-render with changed details as normal', () => {
    const { rerender } = render(renderDetails(1))
    rerender(renderDetails(2))

    expect(logSpy).toHaveBeenLastCalledWith(
      '%c • Colors - re-render #1 → changed: page',
      'color:lightgreen',
      { page: 2 }
    )
  })

  it('marks a re-render with unchanged details as suspicious', () => {
    const { rerender } = render(renderDetails(1))
    rerender(renderDetails(1))

    expect(logSpy).toHaveBeenLastCalledWith(
      '%c • Colors - re-render #1 → nothing changed',
      'color:orange',
      { page: 1 }
    )
  })

  it('without details, marks only re-renders within burstWindow as suspicious', () => {
    vi.useFakeTimers()
    const renderTree = () => (
      <RenderLogProvider burstWindow={100} debugEnabled>
        <Logged name="Burst" />
      </RenderLogProvider>
    )

    const { rerender } = render(renderTree())
    vi.advanceTimersByTime(50)
    rerender(renderTree())
    vi.advanceTimersByTime(150)
    rerender(renderTree())
    vi.useRealTimers()

    expect(logSpy.mock.calls).toEqual([
      ['%c • Burst - mount', 'color:lightgreen'],
      ['%c • Burst - re-render #1', 'color:orange'],
      ['%c • Burst - re-render #2', 'color:lightgreen'],
    ])
  })
})

describe('RenderLogProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Debug>
        <span>child</span>
      </Debug>
    )
    expect(getByText('child')).toBeInTheDocument()
  })

  it('uses custom colors', () => {
    render(
      <RenderLogProvider colors={{ mount: 'blue', rerender: 'red' }} debugEnabled>
        <Logged name="Colored" />
      </RenderLogProvider>
    )
    expect(logSpy).toHaveBeenCalledWith(expect.any(String), 'color:blue')
  })

  it('does not re-render consumers when inline colors keep the same values', () => {
    // Stable element: it re-renders only when the context value changes
    const consumer = <Logged name="Consumer" />

    const { rerender } = render(
      <RenderLogProvider colors={{ mount: 'blue', rerender: 'red' }} debugEnabled>
        {consumer}
      </RenderLogProvider>
    )
    rerender(
      <RenderLogProvider colors={{ mount: 'blue', rerender: 'red' }} debugEnabled>
        {consumer}
      </RenderLogProvider>
    )

    expect(logMessages()).toEqual(['%c • Consumer - mount'])
  })
})

describe('withRenderLog', () => {
  it('renders the wrapped component and logs its renders', () => {
    function Card({ label }: { label: string }) {
      return <span>{label}</span>
    }
    const Wrapped = withRenderLog(Card)

    const { getByText } = render(
      <Debug>
        <Wrapped label="hello" />
      </Debug>
    )

    expect(getByText('hello')).toBeInTheDocument()
    expect(logMessages()).toEqual(['%c • Card - mount'])
  })

  it('uses the custom name as displayName and in the log', () => {
    function Base() {
      return null
    }
    const Wrapped = withRenderLog(Base, { name: 'CustomName' })

    render(
      <Debug>
        <Wrapped />
      </Debug>
    )

    expect(Wrapped.displayName).toBe('CustomName')
    expect(logMessages()).toEqual(['%c • CustomName - mount'])
  })

  it('appends renderLogId to the name and does not pass it to the component', () => {
    let receivedProps: object = {}
    function Item(props: { label: string }) {
      receivedProps = props
      return null
    }
    const Wrapped = withRenderLog(Item)

    render(
      <Debug>
        <Wrapped label="hello" renderLogId={42} />
      </Debug>
    )

    expect(logMessages()).toEqual(['%c • Item.42 - mount'])
    expect(receivedProps).toEqual({ label: 'hello' })
  })

  it('passes expected to the hook', () => {
    function Base() {
      return null
    }
    const Wrapped = withRenderLog(Base, { expected: 1 })

    const { rerender } = render(
      <Debug>
        <Wrapped />
      </Debug>
    )
    rerender(
      <Debug>
        <Wrapped />
      </Debug>
    )

    expect(errorSpy).toHaveBeenCalledWith('%c • Base - unexpected render (2/1)!', 'color:red', {})
  })

  it('logs props as details', () => {
    function Card({ label }: { label: string }) {
      return <span>{label}</span>
    }
    const Wrapped = withRenderLog(Card)

    const { rerender } = render(
      <Debug>
        <Wrapped label="a" />
      </Debug>
    )
    rerender(
      <Debug>
        <Wrapped label="a" />
      </Debug>
    )
    rerender(
      <Debug>
        <Wrapped label="b" />
      </Debug>
    )

    expect(logSpy.mock.calls).toEqual([
      ['%c • Card - mount', 'color:lightgreen', { label: 'a' }],
      ['%c • Card - re-render #1 → nothing changed', 'color:orange', { label: 'a' }],
      ['%c • Card - re-render #2 → changed: label', 'color:lightgreen', { label: 'b' }],
    ])
  })

  it('accepts props declared as an interface', () => {
    interface Props {
      label: string
    }
    function Base({ label }: Props) {
      return <span>{label}</span>
    }
    const Wrapped = withRenderLog(Base)

    const { getByText } = render(<Wrapped label="from interface" />)

    expect(getByText('from interface')).toBeInTheDocument()
  })
})
