import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      // Pages: the portfolio itself, the gesture demo at /gesture-demo/
      // (shown inside the "Try it yourself" section and shareable on its own),
      // and the link-in-bio page at /links/.
      input: {
        main: page('./index.html'),
        gestureDemo: page('./gesture-demo/index.html'),
        links: page('./links/index.html'),
      },
    },
  },
})
