import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  // The SSR (prerender) build bundles these CommonJS packages so Node can import them.
  ssr: {
    noExternal: ['react-helmet-async', 'react-router-dom', 'react-router', '@remix-run/router', '@heroicons/react'],
  },
})
