import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Esto es importante para GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          howler: ['howler']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 