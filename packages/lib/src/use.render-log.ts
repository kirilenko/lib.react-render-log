import { useContext, useEffect, useRef } from 'react'

import { RenderLogContext } from './render-log.context'
import { getDetailsChanges, writeRenderLog } from './render-log.features'
import type { RenderLogOptions } from './render-log.types'

type RenderLogState = {
  commits: number
  lastCommitAt: number
  lastRender: object | null
  prevDetails?: Record<string, unknown>
}

// Counts commits of this component instance: renders React discards (strict-mode
// double render, interrupted concurrent renders) never reach the effect
export const useRenderLog = (name: string, options: RenderLogOptions = {}): void => {
  const { details, expected } = options
  const { burstWindow, colors, debugEnabled } = useContext(RenderLogContext)
  const stateRef = useRef<RenderLogState>({ commits: 0, lastCommitAt: 0, lastRender: null })

  // A new object per render: strict mode re-runs effects of the same render on mount,
  // and this identity tells such a re-run apart from a new commit
  const render = {}

  useEffect(() => {
    const current = stateRef.current
    if (current.lastRender === render) return
    current.lastRender = render
    current.commits += 1

    const now = Date.now()
    const sincePrevCommit = now - current.lastCommitAt
    current.lastCommitAt = now

    if (!debugEnabled) return

    // Compared with the last logged render, so changes made while logging was off still show up
    const changes = details
      ? getDetailsChanges(current.prevDetails, details)
      : { byReference: [], byValue: [] }
    current.prevDetails = details

    // With `details` a re-render is justified only by a key whose value changed (a new
    // reference alone is what breaks `memo`); without them only timing is known, and
    // a quick burst of re-renders is what usually needs fixing
    const isSuspicious =
      current.commits > 1 &&
      (details ? changes.byValue.length === 0 : sincePrevCommit < burstWindow)

    writeRenderLog({
      changes,
      colors,
      commits: current.commits,
      details,
      expected,
      isSuspicious,
      name,
    })
  })
}
