import type { Context } from 'react'
import { createContext } from 'react'

import type { RenderLogContextValue } from './render-log.types'

const initialRenderLogContextValue: RenderLogContextValue = () => () => {}

export const RenderLogContext = ((): Context<RenderLogContextValue> =>
  createContext<RenderLogContextValue>(initialRenderLogContextValue))()
