import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { RenderLogProvider } from './render-log.provider'
import { withRenderLog } from './with.render-log'
import { useRenderLog } from './use.render-log'
import type { PropsWithRenderLog } from './render-log.types'

afterEach(() => vi.restoreAllMocks())

describe('RenderLogProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <span>child</span>
      </RenderLogProvider>
    )
    expect(getByText('child')).toBeInTheDocument()
  })

  it('does not log when debugEnabled is false', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    function Child() {
      const getRenderLog = useRenderLog()
      getRenderLog('Child')()
      return null
    }

    render(
      <RenderLogProvider debugEnabled={false} isStrictMode={false}>
        <Child />
      </RenderLogProvider>
    )

    expect(spy).not.toHaveBeenCalled()
  })

  it('logs to console when debugEnabled is true', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    function Child() {
      const getRenderLog = useRenderLog()
      getRenderLog('Child')()
      return null
    }

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <Child />
      </RenderLogProvider>
    )

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('%c'),
      expect.stringContaining('color:')
    )
  })

  it('includes the display name in the log message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    function Child() {
      const getRenderLog = useRenderLog()
      getRenderLog('MyComponent')()
      return null
    }

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <Child />
      </RenderLogProvider>
    )

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('MyComponent'), expect.any(String))
  })
})

describe('expected render count', () => {
  it('does not error when render count is within expected', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})

    function WithinExpected() {
      const getRenderLog = useRenderLog()
      getRenderLog('WithinExpected')({ expected: 2 })
      return null
    }

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <WithinExpected />
      </RenderLogProvider>
    )

    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('logs console.error when render count exceeds expected', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})

    let renderCount = 0

    function ExceedsExpected() {
      const getRenderLog = useRenderLog()
      renderCount++
      getRenderLog('ExceedsExpected')({ expected: 1 })
      return null
    }

    const { rerender } = render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <ExceedsExpected />
      </RenderLogProvider>
    )

    rerender(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <ExceedsExpected />
      </RenderLogProvider>
    )

    expect(renderCount).toBe(2)
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('unexpected render (2/1)'),
      expect.any(String)
    )
  })

  it('still logs normally when expected is not exceeded', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    function NormalLog() {
      const getRenderLog = useRenderLog()
      getRenderLog('NormalLog')({ expected: 3 })
      return null
    }

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <NormalLog />
      </RenderLogProvider>
    )

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('NormalLog'), expect.any(String))
  })

  it('backward compatible: plain args still work', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    function PlainArgs() {
      const getRenderLog = useRenderLog()
      getRenderLog('PlainArgs')('some context')
      return null
    }

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <PlainArgs />
      </RenderLogProvider>
    )

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('some context'), expect.any(String))
  })
})

describe('withRenderLog', () => {
  it('renders the wrapped component', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})

    type Props = { label: string }
    function Base({ label }: PropsWithRenderLog<Props>) {
      return <span>{label}</span>
    }
    const Wrapped = withRenderLog(Base)

    const { getByText } = render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <Wrapped label="hello" />
      </RenderLogProvider>
    )

    expect(getByText('hello')).toBeInTheDocument()
  })

  it('sets displayName on the wrapper', () => {
    type Props = Record<string, unknown>
    function Base(_: PropsWithRenderLog<Props>) {
      return null
    }
    const Wrapped = withRenderLog(Base, 'CustomName')
    expect(Wrapped.displayName).toBe('CustomName')
  })

  it('uses custom displayName in log output', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    type Props = Record<string, unknown>
    function Base(_: PropsWithRenderLog<Props>) {
      return null
    }
    const Wrapped = withRenderLog(Base, 'CustomName')

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <Wrapped />
      </RenderLogProvider>
    )

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('CustomName'), expect.any(String))
  })

  it('appends renderLogId to the display name when provided', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})

    type Props = Record<string, unknown>
    function Base(_: PropsWithRenderLog<Props>) {
      return null
    }
    const Wrapped = withRenderLog(Base, 'Item')

    render(
      <RenderLogProvider debugEnabled isStrictMode={false}>
        <Wrapped renderLogId={42} />
      </RenderLogProvider>
    )

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Item.42'), expect.any(String))
  })
})
