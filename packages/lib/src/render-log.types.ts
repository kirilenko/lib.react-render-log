import type { ComponentType, PropsWithChildren } from 'react'

export type RenderLogColors = {
  mount: string
  rerender: string
}

export type RenderLogProviderProps = PropsWithChildren<{
  colors?: RenderLogColors
  debugEnabled: boolean
}>

export type RenderLogContextValue = {
  colors: RenderLogColors
  debugEnabled: boolean
}

export type RenderLogOptions = {
  // Max commits per mount; exceeding it logs `console.error`
  expected?: number
  // Values logged with each render; keys that changed since the previous render are listed
  details?: Record<string, unknown>
}

export type PropsWithRenderLogId<Props extends object> = Props & {
  renderLogId?: string | number
}

export type WithRenderLogOptions = {
  name?: string
  expected?: number
}

export type WithRenderLog = <Props extends object>(
  Component: ComponentType<Props>,
  options?: WithRenderLogOptions
) => ComponentType<PropsWithRenderLogId<Props>>
