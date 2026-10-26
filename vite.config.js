// The demo page (demo/), for working on the package without a host app.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'demo',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: { fs: { allow: ['..'] } }
})
