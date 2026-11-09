import type { FC } from 'react'
import { useMemo } from 'react'

import { defaultColors, RenderLogContext } from './render-log.context'
import type { RenderLogContextValue, RenderLogProviderProps } from './render-log.types'

export const RenderLogProvider: FC<RenderLogProviderProps> = ({
  children,
  colors: { mount, rerender } = defaultColors,
  debugEnabled,
}) => {
  // Depends on the color values rather than the `colors` object, so an inline
  // `colors={{ … }}` doesn't re-render every consumer on each provider render
  const value = useMemo<RenderLogContextValue>(
    () => ({ colors: { mount, rerender }, debugEnabled }),
    [debugEnabled, mount, rerender]
  )

  return <RenderLogContext.Provider {...{ value }}>{children}</RenderLogContext.Provider>
}
