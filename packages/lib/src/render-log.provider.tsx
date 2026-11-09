import type { FC } from 'react'
import { useMemo } from 'react'

import { RenderLogContext } from './render-log.context'
import { renderLogCreator } from './render-log.features'
import type {
  RenderLogColors,
  RenderLogContextValue,
  RenderLogProviderProps,
} from './render-log.types'

const defaultColors: RenderLogColors = {
  extraRender: 'orange',
  firstRender: 'lightgreen',
}

const defaultTimeToLive = 500

export const RenderLogProvider: FC<RenderLogProviderProps> = ({
  children,
  colors: { extraRender, firstRender } = defaultColors,
  debugEnabled,
  isStrictMode,
  timeToLive = defaultTimeToLive,
}) => {
  // Depends on the color values rather than the `colors` object, so an inline
  // `colors={{ … }}` doesn't re-render every consumer on each provider render
  const value = useMemo<RenderLogContextValue>(
    () =>
      debugEnabled
        ? (displayName: string) =>
            renderLogCreator({
              colors: { extraRender, firstRender },
              isStrictMode,
              key: displayName,
              timeToLive,
            })
        : () => () => {},
    [debugEnabled, extraRender, firstRender, isStrictMode, timeToLive]
  )

  return <RenderLogContext.Provider {...{ value }}>{children}</RenderLogContext.Provider>
}
