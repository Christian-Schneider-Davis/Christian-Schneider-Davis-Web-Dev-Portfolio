import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      // Two pages: the portfolio itself, and the gesture demo at /gesture-demo/
      // (shown inside the "Try it yourself" section and shareable on its own).
      input: {
        main: page('./index.html'),
        gestureDemo: page('./gesture-demo/index.html'),
      },
    },
  },
})
