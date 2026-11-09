import { createContext } from 'react'

import type { RenderLogContextValue } from './render-log.types'

export const defaultColors = {
  mount: 'lightgreen',
  rerender: 'orange',
}

// Without a provider nothing is logged
export const RenderLogContext = createContext<RenderLogContextValue>({
  colors: defaultColors,
  debugEnabled: false,
})
