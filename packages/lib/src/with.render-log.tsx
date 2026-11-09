import type { ComponentType, ReactElement } from 'react'

import type { PropsWithRenderLogId, WithRenderLog, WithRenderLogOptions } from './render-log.types'
import { useRenderLog } from './use.render-log'

export const withRenderLog: WithRenderLog = <Props extends object>(
  Component: ComponentType<Props>,
  { expected, name }: WithRenderLogOptions = {}
): ComponentType<PropsWithRenderLogId<Props>> => {
  // Skips empty strings too: anonymous components have `name === ''`
  const displayName =
    [name, Component.displayName, Component.name].find(Boolean) ?? 'Unknown Component'

  const C = (props: PropsWithRenderLogId<Props>): ReactElement<Props> => {
    const { renderLogId: id = '', ...ownProps } = props
    useRenderLog(id === '' ? displayName : `${displayName}.${id}`, { expected })

    return <Component {...(ownProps as Props)} />
  }

  C.displayName = displayName

  return C
}
