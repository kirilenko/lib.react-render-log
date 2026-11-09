import type { ComponentType, ReactElement } from 'react'

import type { PropsWithRenderLog, PropsWithRenderLogId, WithRenderLog } from './render-log.types'
import { useRenderLog } from './use.render-log'

export const withRenderLog: WithRenderLog = <Props extends Record<string, unknown>>(
  Component: ComponentType<PropsWithRenderLog<Props>>,
  customDisplayName?: string
): ComponentType<PropsWithRenderLogId<Props>> => {
  // Skips empty strings too: anonymous components have `name === ''`
  const displayName =
    [customDisplayName, Component.displayName, Component.name].find(Boolean) ?? 'Unknown Component'

  const C = (props: PropsWithRenderLogId<Props>): ReactElement<Props> => {
    const getRenderLog = useRenderLog()
    const { renderLogId: id = '' } = props
    getRenderLog(`${displayName}${id === '' ? '' : `.${id}`}`)()

    return <Component {...props} {...{ getRenderLog }} />
  }

  C.displayName = displayName

  return C
}
