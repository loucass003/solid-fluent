import { Accessor, children, createContext, createMemo, JSX, useContext } from 'solid-js'
import { FluentBundle, FluentVariable } from '@fluent/bundle'
import { createParseMarkup } from './markup'

export interface FluentElementOptions {
  attrs?: Record<string, boolean>
  vars?: Record<string, FluentVariable>
  elems?: Record<string, JSX.Element>
}

export interface FluentContextData {
  bundleAccessor: Accessor<FluentBundle>
  getString(id: string, vars?: Record<string, FluentVariable>, fallback?: string): Accessor<string>
  getElement(source: JSX.Element, id: string, options?: FluentElementOptions): JSX.Element
}

export const FluentContext = createContext<FluentContextData>()

export const useFluent = () => {
  const context = useContext(FluentContext)
  if (!context) throw new Error('useFluent was used without wrapping it in a <FluentProvider />')
  return context
}

export const reportError = (error: Error) => {
  // eslint-disable-next-line no-console
  console.warn(`[@llelievr.dev/solid-fluent] ${error.name}: ${error.message}`)
}

export const provideFluent = (bundleAccessor: Accessor<FluentBundle>): FluentContextData => {
  const makupParser = createParseMarkup()
  return {
    bundleAccessor,
    getString(id: string, vars?: Record<string, FluentVariable>, fallback?: string) {
      return createMemo(() => {
        const bundle = bundleAccessor()
        const message = bundle.getMessage(id)
        if (!message || !message.value) return fallback || id
        const errors: Error[] = []
        const value = bundle.formatPattern(message.value, vars, errors)
        for (const error of errors) {
          reportError(error)
        }
        return value
      })
    },
    getElement(source, id, options) {
      const bundle = bundleAccessor()
      const message = bundle.getMessage(id)
      const c = children(() => source)() //FIXME: might be slow idk
      if (!message) return source
      if (c instanceof Element) {
        const errors: Error[] = []
        for (const [name, value] of Object.entries(message.attributes)) {
          if (options?.attrs?.[name] !== false) {
            c.setAttribute(name, bundle.formatPattern(value, options?.vars, errors))
          }
        }
        for (const error of errors) reportError(error)
      }

      if (message.value) {
        const errors: Error[] = []
        const messageValue = bundle.formatPattern(message.value, options?.vars, errors)
        for (const error of errors) reportError(error)

        const elemsLower: Map<string, JSX.Element> | undefined =
          options?.elems &&
          Object.entries(options.elems).reduce(
            (curr, [name, elem]) => curr.set(name.toLowerCase(), children(() => elem)()),
            new Map(),
          )

        const translationNodes = makupParser(messageValue)
        const translatedChildren = translationNodes.map(({ nodeName, textContent }) => {
          if (nodeName === '#text') {
            return textContent
          }

          const childName = nodeName.toLowerCase()
          const sourceChild = elemsLower?.get(childName)

          if (!sourceChild) {
            return textContent
          }

          if (typeof sourceChild === 'string') return sourceChild

          if (sourceChild instanceof Element && textContent) {
            sourceChild.innerHTML = textContent
          }

          return sourceChild
        })
        return translatedChildren
      }
      return source
    },
  }
}
