import { useContext } from 'react'

import { RenderLogContext } from './render-log.context'
import { RenderLogContextValue } from './render-log.types'

export const useRenderLog = (): RenderLogContextValue =>
  useContext<RenderLogContextValue>(RenderLogContext)
