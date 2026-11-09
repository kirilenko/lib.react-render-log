import type { ComponentType, Ref } from 'react'
import { forwardRef } from 'react'

import type { WithRenderLog, WithRenderLogOptions } from './render-log.types'
import { useRenderLog } from './use.render-log'

// Statics React itself reads, or that belong to the function or class itself
const nonHoistedStatics = new Set([
  '$$typeof',
  'arguments',
  'caller',
  'childContextTypes',
  'compare',
  'contextType',
  'contextTypes',
  'defaultProps',
  'displayName',
  'getDefaultProps',
  'getDerivedStateFromError',
  'getDerivedStateFromProps',
  'length',
  'name',
  'propTypes',
  'prototype',
  'render',
  'type',
])

const hoistStatics = (target: object, source: object): void => {
  Object.getOwnPropertyNames(source).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(source, key)
    if (!nonHoistedStatics.has(key) && !(key in target) && descriptor) {
      Object.defineProperty(target, key, descriptor)
    }
  })
}

type AnyProps = Record<string, unknown>

export const withRenderLog: WithRenderLog = (
  Component,
  { expected, name }: WithRenderLogOptions = {}
) => {
  const Inner = Component as unknown as ComponentType<AnyProps>

  // Skips empty strings too: anonymous components have `name === ''`
  const displayName = [name, Inner.displayName, Inner.name].find(Boolean) ?? 'Unknown Component'

  // forwardRef keeps refs working on React 18, where `ref` is not a regular prop
  // eslint-disable-next-line @eslint-react/no-forward-ref
  const C = forwardRef((props: AnyProps & { renderLogId?: string | number }, ref: Ref<unknown>) => {
    const { renderLogId: id = '', ...ownProps } = props
    // Props as details: a re-render with the same props is the one `memo` would have skipped
    useRenderLog(id === '' ? displayName : `${displayName}.${id}`, {
      details: ownProps,
      expected,
    })

    // Without a ref, `ref={null}` would show up in props on React 19
    return <Inner {...ownProps} {...(ref ? { ref } : {})} />
  })

  C.displayName = displayName
  hoistStatics(C, Component)

  // The props and statics types are worked out in `WithRenderLog`
  return C as never
}
