// Server entry used only at build time by scripts/prerender.mjs to turn every route
// into static HTML (so crawlers and AI assistants get real content without JavaScript).
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { PRODUCTS } from './data/products.js'
import { SERVICES } from './data/services.js'
import { RESOURCES } from './data/resources.js'
import { WORK } from './data/work.js'
import { FAQ } from './data/faq.js'
import { SITE } from './data/site.js'

export { PRODUCTS, SERVICES, RESOURCES, WORK, FAQ, SITE }

export function render(url) {
  const helmetContext = {}
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>,
  )
  const { helmet } = helmetContext
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join('\n    ')
  return { html, head }
}
