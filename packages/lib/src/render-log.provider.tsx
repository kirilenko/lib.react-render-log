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
  colors = defaultColors,
  debugEnabled,
  isStrictMode,
  timeToLive = defaultTimeToLive,
}) => {
  const value = useMemo<RenderLogContextValue>(
    () =>
      debugEnabled
        ? (displayName: string) =>
            renderLogCreator({ colors, isStrictMode, key: displayName, timeToLive })
        : () => () => {},
    [colors, debugEnabled, isStrictMode, timeToLive]
  )

  return <RenderLogContext.Provider {...{ value }}>{children}</RenderLogContext.Provider>
}
