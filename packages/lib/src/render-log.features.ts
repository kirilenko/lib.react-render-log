import type { RenderLog, RenderLogColors } from './render-log.types'

type LogCaseWithMessage = { color: string; message?: string }

type LogCaseWithMessageGetter = {
  color: string
  getMessage?: (repeatsCount: number) => string
}

type LogCase = LogCaseWithMessage | LogCaseWithMessageGetter

type GetLogCases = (p: {
  colors: RenderLogColors
  isStrictMode: boolean
}) => [LogCase, LogCase, LogCase]

const getLogCases: GetLogCases = ({ colors, isStrictMode }) => {
  const secondRenderCaseByStrictMode: LogCase = {
    color: colors.firstRender,
    message: ' - repeat by strict-mode',
  }

  const extraRenderCase: LogCase = {
    color: colors.extraRender,
    getMessage: (repeatsCount) => ` - extra repeats (${repeatsCount})!`,
  }

  return [
    { color: colors.firstRender },
    isStrictMode ? secondRenderCaseByStrictMode : extraRenderCase,
    extraRenderCase,
  ]
}

type CacheRecord = { repetitionsCount: number; timestamp: number; timeToLive: number }

// Exported for tests only, not part of the public API
export const cache = new Map<string, CacheRecord>()

let lastSweepAt = 0

// An expired record counts the same as a missing one, so deleting it changes nothing
// but keeps the cache from growing with every key ever logged (e.g. `renderLogId` per list item)
const sweepExpired = (now: number, timeToLive: number): void => {
  if (now - lastSweepAt < timeToLive) return
  lastSweepAt = now
  cache.forEach((record, key) => {
    if (now - record.timestamp >= record.timeToLive) cache.delete(key)
  })
}

const getUpdatedRepetitionsCount = (props: { key: string; timeToLive: number }): number => {
  const { key, timeToLive } = props
  const now = Date.now()
  sweepExpired(now, timeToLive)

  const record = cache.get(key)
  const updatedRepetitionsCount =
    record && now - record.timestamp < timeToLive ? record.repetitionsCount + 1 : 0

  cache.set(key, { repetitionsCount: updatedRepetitionsCount, timestamp: now, timeToLive })

  return updatedRepetitionsCount
}

export type RenderLogOptions = { expected: number }

const isRenderLogOptions = (value: unknown): value is RenderLogOptions =>
  value !== null &&
  typeof value === 'object' &&
  'expected' in value &&
  typeof (value as Record<string, unknown>).expected === 'number'

export const renderLogCreator = (props: {
  key: string
  colors: RenderLogColors
  isStrictMode: boolean
  timeToLive: number
}): RenderLog => {
  const { colors, isStrictMode, key, timeToLive } = props

  const repetitionsCount = getUpdatedRepetitionsCount({ key, timeToLive })
  const actualCount = repetitionsCount + 1

  const currentCase = getLogCases({ colors, isStrictMode })[
    repetitionsCount > 2 ? 2 : repetitionsCount
  ]!

  return (...args) => {
    const firstArg = args[0]
    const options = isRenderLogOptions(firstArg) ? firstArg : undefined
    const restArgs = options ? args.slice(1) : args

    if (options && actualCount > options.expected) {
      const errorMessage = `%c • ${key} - unexpected render (${actualCount}/${options.expected})!`
      console.error(errorMessage, 'color:red')
      return
    }

    const { message } = currentCase as LogCaseWithMessage
    const { getMessage } = currentCase as LogCaseWithMessageGetter
    const currentCaseMessage = message ?? getMessage?.(repetitionsCount) ?? ''
    const argsArrow = restArgs.length ? ' ⟶' : ''

    // Args go to the console as is, so objects stay expandable in DevTools
    // eslint-disable-next-line no-console
    console.log(
      `%c • ${key + currentCaseMessage + argsArrow}`,
      `color:${currentCase.color}`,
      ...restArgs
    )
  }
}
