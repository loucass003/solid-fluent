import { createSignal, ParentComponent, type Component } from 'solid-js'
import { FluentProvider } from 'src/components/FluentProvider'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { useFluent } from 'src/hooks/context'
import { Localized } from 'src/components/Localized'

const DirectString: Component = () => {
  // you can access fluent translations from the useFluent hook
  const fluent = useFluent()

  return <>{fluent.getString('welcome', { name: 'Test' })()}</>
}

const Bold: ParentComponent = props => (
  <div style={{ background: 'red', display: 'inline-block' }}>{props.children}</div>
)

const App: Component = () => {
  // Load your resources, using @fluent/bundle
  let resource = new FluentResource(`
-brand-name = Foo 3000
welcome = Welcome, {$name}, to {-brand-name}!
elements =
    .placeholder = I am a placehoder
    .alt = I am a alt
markups = <b>I am bold</b> WOW
  `)

  let resourceFR = new FluentResource(`
-brand-name = Foo 3000
welcome = bienvenue {$name}, sur {-brand-name}!
elements =
    .placeholder = Je suis un example
    .alt = I suis une indication
markups = <b>je suis en gras</b> WOW
`)

  let bundle = new FluentBundle('en-US')
  // Attach the resource to a bundle
  bundle.addResource(resource)

  let bundleFR = new FluentBundle('fr-FR')
  bundleFR.addResource(resourceFR)

  let [currentBundle, setBundle] = createSignal<FluentBundle>(bundle)

  let lang = 0
  const randomLang = () => {
    const bundles = [bundle, bundleFR]
    setBundle(bundles.at(lang++ % bundles.length) ?? bundle)
  }

  return (
    /* provide the a bundle to the fluent provider */
    <FluentProvider bundle={currentBundle()}>
      <button onClick={() => randomLang()}>Random lang</button>
      <DirectString></DirectString>
      {/* use the Localized to directly replace attributes or div content with your translation keys */}
      <Localized id="elements" vars={{ name: 'test' }} attrs={{ placeholder: true }}>
        <input type="text" placeholder="temp" alt="super alt" />
      </Localized>
      <Localized id="markups" elems={{ b: <Bold></Bold> }}></Localized>

      <Localized id="markups" elems={{ b: <Bold></Bold> }}>
        <div>placeholder that will be replace by the markups content</div>
      </Localized>
    </FluentProvider>
  )
}

export default App
