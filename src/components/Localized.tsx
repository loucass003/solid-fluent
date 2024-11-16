import { children, Component, createMemo, JSX } from 'solid-js'
import { FluentElementOptions, useFluent } from 'src/hooks/context'

interface LocalizedProps extends FluentElementOptions {
  id: string
  children?: JSX.Element
}

const getSource = (children: JSX.Element) => {
  if (Array.isArray(children)) {
    if (children.length > 1) throw new Error('Expected to receive a single element to localize.')
    return children[0]
  } else return children ?? null
}

export const Localized: Component<LocalizedProps> = props => {
  const fluent = useFluent()
  const source = getSource(props.children)
  const fullChildren = children(() => source)

  const result = createMemo(() => {
    const c = fullChildren()
    if (typeof c === 'string') {
      const fallback = typeof source === 'string' ? source : undefined
      return fluent.getString(props.id, props.vars, fallback)
    }

    return fluent.getElement(source, props.id, {
      attrs: props.attrs,
      elems: props.elems,
      vars: props.vars,
    })
  })

  return <>{result()}</>
}
