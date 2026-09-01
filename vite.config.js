import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Deployed to a GitHub Pages project site at https://jaybowen.github.io/cshac/, so the
// production build is served under /cshac/. GitHub Pages has no SPA rewrite, so deep
// links are handled by public/404.html + the decoder in index.html. Dev stays at root.
// For a root/custom-domain deploy instead, set the build base back to '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/cshac/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
