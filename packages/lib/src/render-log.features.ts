import { isValidElement } from 'react'

import type { RenderLogColors } from './render-log.types'

export type DetailsChanges = { byValue: string[]; byReference: string[] }

const maxDepth = 5

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value) as unknown
  return proto === Object.prototype || proto === null
}

// Same shape and values, ignoring identity: any two functions count as equivalent,
// since a new inline callback is a new reference rather than a new value
const isEquivalent = (a: unknown, b: unknown, depth = 0): boolean => {
  if (Object.is(a, b)) return true
  if (typeof a === 'function' && typeof b === 'function') return true
  if (depth >= maxDepth) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => isEquivalent(item, b[i], depth + 1))
  }

  // Elements are compared by type, key and props: their other fields hold React internals
  if (isValidElement(a) && isValidElement(b)) {
    return a.type === b.type && a.key === b.key && isEquivalent(a.props, b.props, depth + 1)
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a)
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => key in b && isEquivalent(a[key], b[key], depth + 1))
    )
  }

  return false
}

export const getDetailsChanges = (
  prev: Record<string, unknown> | undefined,
  next: Record<string, unknown>
): DetailsChanges => {
  const changes: DetailsChanges = { byReference: [], byValue: [] }
  if (!prev) return changes

  new Set([...Object.keys(prev), ...Object.keys(next)]).forEach((key) => {
    if (Object.is(prev[key], next[key])) return
    const isReferenceOnly = key in prev && key in next && isEquivalent(prev[key], next[key])
    changes[isReferenceOnly ? 'byReference' : 'byValue'].push(key)
  })

  return changes
}

const formatChanges = ({ byReference, byValue }: DetailsChanges): string => {
  const parts = [
    byValue.length ? `changed: ${byValue.join(', ')}` : '',
    byReference.length ? `changed by reference: ${byReference.join(', ')}` : '',
  ].filter(Boolean)
  return parts.length ? ` → ${parts.join('; ')}` : ' → nothing changed'
}

export const writeRenderLog = (props: {
  name: string
  commits: number
  colors: RenderLogColors
  expected?: number
  details?: Record<string, unknown>
  changes: DetailsChanges
  isSuspicious: boolean
}): void => {
  const { changes, colors, commits, details, expected, isSuspicious, name } = props
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
  const changed = details && commits > 1 ? formatChanges(changes) : ''

  // Details go to the console as is, so objects stay expandable in DevTools
  // eslint-disable-next-line no-console
  console.log(
    `%c • ${name} - ${label}${changed}`,
    `color:${isSuspicious ? colors.rerender : colors.mount}`,
    ...detailsArgs
  )
}
