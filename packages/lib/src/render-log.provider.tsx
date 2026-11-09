import type { FC } from 'react'
import { useMemo } from 'react'

import { defaultBurstWindow, defaultColors, RenderLogContext } from './render-log.context'
import type { RenderLogContextValue, RenderLogProviderProps } from './render-log.types'

export const RenderLogProvider: FC<RenderLogProviderProps> = ({
  burstWindow = defaultBurstWindow,
  children,
  colors: { mount, rerender } = defaultColors,
  debugEnabled,
}) => {
  // Depends on the color values rather than the `colors` object, so an inline
  // `colors={{ … }}` doesn't re-render every consumer on each provider render
  const value = useMemo<RenderLogContextValue>(
    () => ({ burstWindow, colors: { mount, rerender }, debugEnabled }),
    [burstWindow, debugEnabled, mount, rerender]
  )

  return <RenderLogContext.Provider {...{ value }}>{children}</RenderLogContext.Provider>
}
