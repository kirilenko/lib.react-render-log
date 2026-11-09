import type { ComponentType, JSXElementConstructor, PropsWithChildren } from 'react'

export type RenderLogColors = {
  // Mount and re-renders with a visible reason
  mount: string
  // Suspicious re-renders: nothing in `details` changed, or a burst without `details`
  rerender: string
}

export type RenderLogProviderProps = PropsWithChildren<{
  // Without `details`, a re-render sooner than this (ms) after the previous one is suspicious
  burstWindow?: number
  colors?: RenderLogColors
  debugEnabled: boolean
}>

export type RenderLogContextValue = {
  burstWindow: number
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

// Static members of the component that the HOC copies over, e.g. `Card.Header`
export type HoistedStatics<Comp> = Omit<
  Comp,
  'contextType' | 'defaultProps' | 'displayName' | 'propTypes' | 'prototype'
>

type PropsOf<Comp> = Comp extends JSXElementConstructor<infer Props extends object> ? Props : never

// JSXElementConstructor rather than ComponentType: with React 18 types, `propTypes`
// keeps forwardRef components from matching `ComponentType<never>`
export type WithRenderLog = <Comp extends JSXElementConstructor<never>>(
  Component: Comp,
  options?: WithRenderLogOptions
) => ComponentType<PropsWithRenderLogId<PropsOf<Comp>>> & HoistedStatics<Comp>
