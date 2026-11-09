import type { RenderLogColors } from './render-log.types'

export const getChangedKeys = (
  prev: Record<string, unknown> | undefined,
  next: Record<string, unknown>
): string[] => {
  if (!prev) return []
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)])
  return [...keys].filter((key) => !Object.is(prev[key], next[key]))
}

export const writeRenderLog = (props: {
  name: string
  commits: number
  colors: RenderLogColors
  expected?: number
  details?: Record<string, unknown>
  changedKeys: string[]
}): void => {
  const { changedKeys, colors, commits, details, expected, name } = props
  const detailsArgs = details ? [details] : []

  if (expected !== undefined && commits > expected) {
    console.error(
      `%c • ${name} - unexpected render (${commits}/${expected})!`,
      'color:red',
      ...detailsArgs
    )
    return
  }

  const label = commits === 1 ? 'mount' : `re-render #${commits - 1}`
  const changed = changedKeys.length ? ` ⟶ changed: ${changedKeys.join(', ')}` : ''

  // Details go to the console as is, so objects stay expandable in DevTools
  // eslint-disable-next-line no-console
  console.log(
    `%c • ${name} - ${label}${changed}`,
    `color:${commits === 1 ? colors.mount : colors.rerender}`,
    ...detailsArgs
  )
}
