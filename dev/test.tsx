import { renderToString } from 'solid-js/web'

import App from './App'

const html = renderToString(() => <App />)

console.log(html)
