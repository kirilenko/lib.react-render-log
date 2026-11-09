import { useContext, useEffect, useRef } from 'react'

import { RenderLogContext } from './render-log.context'
import { getChangedKeys, writeRenderLog } from './render-log.features'
import type { RenderLogOptions } from './render-log.types'

type RenderLogState = {
  commits: number
  lastRender: object | null
  prevDetails?: Record<string, unknown>
}

// Counts commits of this component instance: renders React discards (strict-mode
// double render, interrupted concurrent renders) never reach the effect
export const useRenderLog = (name: string, options: RenderLogOptions = {}): void => {
  const { details, expected } = options
  const { colors, debugEnabled } = useContext(RenderLogContext)
  const stateRef = useRef<RenderLogState>({ commits: 0, lastRender: null })

  // A new object per render: strict mode re-runs effects of the same render on mount,
  // and this identity tells such a re-run apart from a new commit
  const render = {}

  useEffect(() => {
    const current = stateRef.current
    if (current.lastRender === render) return
    current.lastRender = render
    current.commits += 1

    const changedKeys = details ? getChangedKeys(current.prevDetails, details) : []
    current.prevDetails = details

    if (debugEnabled) {
      writeRenderLog({ changedKeys, colors, commits: current.commits, details, expected, name })
    }
  })
}
