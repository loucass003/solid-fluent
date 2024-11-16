import { FluentBundle } from '@fluent/bundle'
import { ParentComponent } from 'solid-js'
import { FluentContext, provideFluent } from 'src/hooks/context'

export interface FlientProviderProps {
  bundle: FluentBundle
}

export const FluentProvider: ParentComponent<FlientProviderProps> = props => {
  const fluent = provideFluent(() => props.bundle)

  return <FluentContext.Provider value={fluent}>{props.children}</FluentContext.Provider>
}
