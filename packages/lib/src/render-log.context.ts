import { createContext } from 'react'

import type { RenderLogContextValue } from './render-log.types'

export const defaultColors = {
  mount: 'lightgreen',
  rerender: 'orange',
}

export const defaultBurstWindow = 500

// Without a provider nothing is logged
export const RenderLogContext = createContext<RenderLogContextValue>({
  burstWindow: defaultBurstWindow,
  colors: defaultColors,
  debugEnabled: false,
})
